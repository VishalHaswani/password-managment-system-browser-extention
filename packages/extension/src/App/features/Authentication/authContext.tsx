import { createContext, useContext, useState, useCallback } from 'react'
import { type AxiosInstance } from 'axios'

import axiosClient from '../../axiosClient'
import { LoginInput, LoginResponse } from '../../../types'
import { loginUserDummy } from '../../../api/dummyAPI'

// TODO: this file has no proper function for now, nneds more work done on it

export interface UseLoginStatusType {
  isLoggedIn: boolean
  login: (loginInput: LoginInput) => Promise<LoginResponse>
}

export interface AuthContextType extends UseLoginStatusType {
  axiosClient: AxiosInstance
}

export interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const useLoginFlow = (): UseLoginStatusType => {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useIsLoggedIn should only be used inside <AuthProvider>')
  }

  return { isLoggedIn: context.isLoggedIn, login: context.login }
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
  /*
  State:
    axiosClient
    isLoggedIn
  methods:
    loginWithCredentials(Id, password)
    logout()
  effect:
    isLoggedIn is true, then add AUTH_TOKEN to axios instance
  */
  const [isLoggedIn] = useState(false)
  const login = useCallback(async (loginInput: LoginInput): Promise<LoginResponse> => {
    if (!isLoggedIn) {
      const loginResponse = await loginUserDummy(loginInput)
      return loginResponse
    } else {
      throw new Error('Already Logged In')
    }
  }, [isLoggedIn])

  return (
    <AuthContext.Provider value={{ axiosClient, isLoggedIn, login }}>
      {children}
    </ AuthContext.Provider>
  )
}

export default AuthProvider
