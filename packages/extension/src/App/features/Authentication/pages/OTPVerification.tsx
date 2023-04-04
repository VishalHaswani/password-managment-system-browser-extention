import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'

import { OTPVerificationInput, OTPVerificationResponse } from '../../../../types'

interface PropsT {
  ifVerifiedGoTo: string
  verifyOTPFn: (otpVerificationInput: OTPVerificationInput) => Promise<OTPVerificationResponse>
  message?: React.ReactNode
}

interface LocationState {
  message: React.ReactNode
}

const OTPVerificationPage: React.FC<PropsT> = (props: PropsT) => {
  const [formData, setFormData] = useState<OTPVerificationInput>({
    otp: ''
  })
  const [css] = useStyletron()
  const navigate = useNavigate()
  const location = useLocation()

  let { message } = location.state as LocationState
  if (message === undefined) {
    message = props.message
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const otpVerifyMutation = useMutation({
    mutationFn: props.verifyOTPFn,
    onSuccess: () => {
      navigate(props.ifVerifiedGoTo)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleSubmit = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    otpVerifyMutation.mutate(formData)
  }

  return (
    <Block
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '70vw',
        marginLeft: 'auto',
        marginRight: 'auto'
      })}
    >
      <Block className={css({ alignItems: 'center', paddingBottom: '30px' })}>{message}</Block>
      <FormControl
      label="OTP"
      error={otpVerifyMutation.isError ? otpVerifyMutation.failureReason as string : undefined}>
        <Input
          type="number"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
        />
      </FormControl>
      <Button onClick={handleSubmit} isLoading={otpVerifyMutation.isLoading}>Verify</Button>
    </Block>
  )
}

export default OTPVerificationPage
