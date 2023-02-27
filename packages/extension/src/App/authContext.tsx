import { createContext } from 'react'
import { AxiosInstance } from 'axios'

import axiosClient from './axiosClient'

export interface AuthContextType {
  axiosClient: AxiosInstance
}

export interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
  /*
  State:
    axiosClient
    isAuthenticated
  methods:
    loginWithCredentials(Id, password)
    logout()
  effect:
    isAuthenticated is true, then add AUTH_TOKEN to axios instance
  */
  return (
    <AuthContext.Provider value={{ axiosClient }}>
      {children}
    </ AuthContext.Provider>
  )
}

export default AuthProvider
