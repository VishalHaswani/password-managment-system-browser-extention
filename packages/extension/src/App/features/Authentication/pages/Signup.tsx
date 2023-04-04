import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'

import { EmailVerificationInput } from '../../../../types'
import { verifyEmailDummy } from '../../../../api/dummyAPI'

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<EmailVerificationInput>({
    email: ''
  })
  const navigate = useNavigate()
  const [css] = useStyletron()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const emailVerifyMutation = useMutation({
    mutationFn: verifyEmailDummy,
    onSuccess: (emailVerifyResponse, emailVerifyInput, context) => {
      navigate('/signup/verifyemail', {
        state:
        {
          message: `Email Sent to ${formData.email} with the OTP`
        }
      })
    }
  })

  const handleVerify = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    emailVerifyMutation.mutate(formData)
  }

  return (
    <Block
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '70vw',
        marginLeft: 'auto',
        marginRight: 'auto'
      })}
    >
      <FormControl label="Email">
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </FormControl>
      <Block className={css({
        display: 'flex',
        width: '50vw',
        justifyContent: 'space-around',
        alignItems: 'center'
      })}>
        <Button onClick={handleVerify} isLoading={emailVerifyMutation.isLoading}>Verify</Button>
      </Block>
    </Block>
  )
}

export default Signup
