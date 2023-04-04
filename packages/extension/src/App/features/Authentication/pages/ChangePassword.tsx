import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { setPasswordDummy } from '../../../../api/dummyAPI'

interface FormData {
  newPassword: string
  confirmPassword: string
}

interface PropsT {
  ifSuccessGoTo: string
}

const ChangePassword: React.FC<PropsT> = (props: PropsT) => {
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: ''
  })
  const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState<string | undefined>(undefined)
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const [css] = useStyletron()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  useEffect(() => {
    if (formData.newPassword.length === 0) {
      setNewPasswordErrorMsg(undefined)
      return
    }

    if (formData.newPassword.length < 12) {
      setNewPasswordErrorMsg('Should have at least 12 charecters')
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      setNewPasswordErrorMsg('Should have at least one uppercase letter')
    } else if (!/[a-z]/.test(formData.newPassword)) {
      setNewPasswordErrorMsg('Should have at least one lowercase letter')
    } else if (!/[0-9]/.test(formData.newPassword)) {
      setNewPasswordErrorMsg('Should have at least one number')
    } else if (!/[!@#&$]/.test(formData.newPassword)) {
      setNewPasswordErrorMsg('Should have at least one special charecter (!, @, #, &, $)')
    } else {
      setNewPasswordErrorMsg(undefined)
    }
  }, [formData.newPassword])

  useEffect(() => {
    if (formData.confirmPassword.length === 0) {
      setConfirmPasswordErrorMsg(undefined)
      return
    }

    if (formData.confirmPassword !== formData.newPassword) {
      setConfirmPasswordErrorMsg('Does not match the New Password')
    } else if (newPasswordErrorMsg !== undefined) {
      setConfirmPasswordErrorMsg(newPasswordErrorMsg)
    } else {
      setConfirmPasswordErrorMsg(undefined)
    }
  }, [formData])

  const savePasswordMutation = useMutation({
    mutationFn: setPasswordDummy,
    onSuccess: (loginResponse, loginInput, context) => {
      // TODO: tell authContext about the login success
      navigate(props.ifSuccessGoTo, { state: { } })
    }
  })

  const handleSave = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    savePasswordMutation.mutate({ newPassword: formData.confirmPassword })
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
      <FormControl
        label="New Password"
        error={newPasswordErrorMsg}>
        <Input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl
        label="Confirm Password"
        error={savePasswordMutation.isError ? savePasswordMutation.failureReason as string : confirmPasswordErrorMsg}>
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </FormControl>
      <Button
        onClick={handleSave}
        isLoading={savePasswordMutation.isLoading}
        disabled={formData.newPassword.length === 0 ||
                  formData.confirmPassword.length === 0 ||
                  newPasswordErrorMsg !== undefined ||
                  confirmPasswordErrorMsg !== undefined
                }
      >Save</Button>
    </Block>)
}

export default ChangePassword
