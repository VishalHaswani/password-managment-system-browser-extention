import { AxiosInstance } from 'axios'

import { LoginInput, LoginResponse } from '../types'

export class AuthApi {
  axiosInstance: AxiosInstance

  constructor (axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  async loginUser (user: LoginInput): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>('apiv1/auth/login', user)
    return response.data
  }
}
