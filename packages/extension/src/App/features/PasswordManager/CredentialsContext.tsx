import React, { createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useEncryptedData from '../../../custom-hooks/useEncryptedData'

import { Credential, Credentials, isCredential } from '../../../types'

export interface UseCredentialsI {
  credentials: Credentials
  updateCredential: (credential: Partial<Credential> | undefined, credentialUUID?: string) => string
}

export interface CredentialContextI extends UseCredentialsI {}

export interface CredentialProviderProps {
  children: React.ReactNode
}

export const CredentialContext = createContext<CredentialContextI | null>(null)

export const useCredentials = (): UseCredentialsI => {
  const context = useContext(CredentialContext)

  if (context === null) {
    throw new Error('useCredentials should only be used inside <CredentialContext>')
  }

  return { credentials: context.credentials, updateCredential: context.updateCredential }
}

const CredentialProvider: React.FC<CredentialProviderProps> = ({ children }: CredentialProviderProps) => {
  const [decryptedData, setDecryptedData] = useEncryptedData<Credentials>('credentials', 'Some Random Key TODO')
  if (decryptedData === null) {
    setDecryptedData({})
  }

  const handleSetCredential = (credential: Partial<Credential> | undefined, credentialUUID = uuidv4()): string => {
    setDecryptedData(credentials => {
      if (credentials === null) {
        if (isCredential(credential)) {
          return { [credentialUUID]: credential }
        } else {
          throw new Error('Expected a variable of type {website: string, username: string, password: string}. Got ' + JSON.stringify(credential))
        }
      }

      if (credential === undefined) {
        const { [credentialUUID]: toDelete, ...rest } = credentials
        return rest
      }

      return { ...credentials, [credentialUUID]: { ...credentials[credentialUUID], ...credential } }
    })
    return credentialUUID
  }
  // TODO: remove 'as Credentials' and figure out the corner case
  return (
    <CredentialContext.Provider value={{ credentials: decryptedData as Credentials, updateCredential: handleSetCredential }}>
      {children}
    </CredentialContext.Provider>
  )
}

export default CredentialProvider
