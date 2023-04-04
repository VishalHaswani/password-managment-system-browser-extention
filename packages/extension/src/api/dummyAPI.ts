import {
  LoginInput,
  LoginResponse,
  OTPVerificationInput,
  OTPVerificationResponse,
  EmailVerificationInput,
  EmailVerificationResponse,
  SetPasswordInput,
  SetPasswordResponse,
  Setup2FactorAuthResponse
} from '../types'

// eslint-disable-next-line @typescript-eslint/no-implied-eval
const delay = async (ms: number): Promise<unknown> => await new Promise((resolve: TimerHandler) => setTimeout(resolve, ms))

// Login
export const loginUserDummy = async (loginInput: LoginInput): Promise<LoginResponse> => {
  await delay(1000)
  if (loginInput.email !== 'vishal.haswani2019@vitstudent.ac.in' ||
      loginInput.password !== 'Vit@1234') {
    return { status: '200' }
  } else {
    return { status: '404' }
  }
}

export const verifyOTPDummy = async (otpVerificationInput: OTPVerificationInput): Promise<OTPVerificationResponse> => {
  await delay(1000)
  if (otpVerificationInput.otp === 123_456) {
    return { status: '200' }
  }
  return { status: '404' }
  // throw new Error('Invalid OTP')
}

// Signup
export const verifyEmailDummy = async (emailVerificationInput: EmailVerificationInput): Promise<EmailVerificationResponse> => {
  await delay(1000)
  if (emailVerificationInput?.email === 'vishal.haswani2019@vitstudent.ac.in') {
    return { status: '200' }
  }
  return { status: '404' }
}

export const setPasswordDummy = async (setPasswordInput: SetPasswordInput): Promise<SetPasswordResponse> => {
  await delay(1000)
  if (setPasswordInput.newPassword !== '') {
    return { status: '200' }
  }
  return { status: '404' }
}

export const setup2FactorAuthDummy = async (): Promise<Setup2FactorAuthResponse> => {
  await delay(1000)
  return {
    status: '200',
    qrCodeSrc: 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=otpauth%3A%2F%2Ftotp%2FJohn%3Fsecret%3DGEZDGNBVGY3TQQSYLFKA%26issuer%3DMyApp'
  }
}
