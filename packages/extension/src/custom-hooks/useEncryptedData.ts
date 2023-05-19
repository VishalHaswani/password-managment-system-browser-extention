import { useEffect, useMemo, useState } from 'react'
import { Buffer } from 'buffer'

import useLocalStorage from './useLocalStorage'
import { ChaCha20 } from '../util/chaCha20'

interface EncryptedData {
  data: string
}

const useEncryptedData = <ValueType>(storageKey: string, encryptionKey: string): [ValueType | null, React.Dispatch<React.SetStateAction<ValueType | null>>] => {
  const [encryptedData, setEncryptedData] = useLocalStorage<EncryptedData>(storageKey)
  const [isDataChangedHere, setIsDataChangedHere] = useState<boolean>(false)

  const nonce: Uint32Array = new Uint32Array([0x00000009, 0x0000004a, 0x00000000])
  const chaCha20 = useMemo(() => new ChaCha20(encryptionKey, nonce), [encryptionKey])

  const [decryptedData, setDecryptedData] = useState<ValueType | null>(() => {
    if (encryptedData === null) {
      return null
    }

    try {
      const newDecryptedData: unknown = JSON.parse(chaCha20.decrypt(Buffer.from(encryptedData.data, 'hex')).toString('utf8'))
      return newDecryptedData as ValueType
    } catch (e) {
      console.error(e)
      console.log('Decrypted data did not make sense')
      return null
    }
  })
  // If encryptionKey changes the encryptedData should also change
  useEffect(() => {
    if (decryptedData === null) {
      return
    }

    if (decryptedData != null) {
      if (isDataChangedHere) {
        setIsDataChangedHere(false)
        return
      }
    }

    const newEncryptedData = chaCha20.encrypt(JSON.stringify(decryptedData)).toString('hex')
    setEncryptedData({ data: newEncryptedData })
    setIsDataChangedHere(true)
  }, [encryptionKey, decryptedData])

  // If encryptedData changes the decryptedData should also change
  useEffect(() => {
    if (encryptedData === null) {
      return
    }

    if (isDataChangedHere) {
      setIsDataChangedHere(false)
      return
    }

    try {
      const newDecryptedData: unknown = JSON.parse(chaCha20.decrypt(Buffer.from(encryptedData.data, 'hex')).toString('utf8'))
      setDecryptedData(newDecryptedData as ValueType)
    } catch (e) {
      console.error(e)
      console.log('Decrypted data did not make sense')
      setDecryptedData(null)
    }
    setIsDataChangedHere(true)
  }, [encryptedData])

  // Return the decyptedData and a method to update decryptedData
  return [decryptedData, setDecryptedData]
}

export default useEncryptedData
