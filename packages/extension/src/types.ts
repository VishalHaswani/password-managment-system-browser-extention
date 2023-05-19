export interface Credential {
  website: string
  username: string
  password: string
}

export const isCredential = (obj: any): obj is Credential => {
  return ('website' in obj && 'username' in obj && 'password' in obj)
}

export type Credentials = Record<string, Credential>

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  status: string
  // TODO: Blocker: Server
}

export interface OTPVerificationInput {
  otp: number | ''
}

export interface OTPVerificationResponse {
  status: string
  // TODO: Blocker: Server
}

export interface EmailVerificationInput {
  email: string
}

export interface EmailVerificationResponse {
  status: string
  // TODO: Blocker: Server
}

export interface SetPasswordInput {
  newPassword: string
}

export interface SetPasswordResponse {
  status: string
  // TODO: Blocker: Server
}

export interface Setup2FactorAuthResponse {
  status: string
  qrCodeSrc: string
}

// API
export interface GenericResponse {
  status: string
  message: string
}
