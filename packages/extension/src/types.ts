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
