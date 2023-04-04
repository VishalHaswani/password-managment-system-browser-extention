import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'

import { LoginInput } from '../../../../types'
import { loginUserDummy } from '../../../../api/dummyAPI'

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const [css] = useStyletron()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const loginMutation = useMutation({
    mutationFn: loginUserDummy,
    onSuccess: (loginResponse, loginInput, context) => {
      // tell authContext about the login success
      navigate('/login/verify', {
        state: {
          message: 'Please enter the code from your authenticator app'
        }
      })
    }
  })

  const handleLogin = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    // TODO: validations
    loginMutation.mutate(formData)
  }

  const handleSignup = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    navigate('/signup')
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
      <FormControl
        label="Password"
        error={loginMutation.isError ? loginMutation.failureReason as string : undefined}>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </FormControl>
      <Block className={css({
        display: 'flex',
        width: '50vw',
        justifyContent: 'space-around',
        alignItems: 'center'
      })}>
        <Button onClick={handleLogin} isLoading={loginMutation.isLoading}>Log In</Button>
        <Button onClick={handleSignup} disabled={loginMutation.isLoading}>Sign Up</Button>
      </Block>
    </Block>
  )
}

export default Login
