import { useEffect, useState } from 'react'
import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import { Button, SIZE as BUTTON_SIZE, SHAPE } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input, SIZE as INPUT_SIZE } from 'baseui/input'
import { HeadingMedium } from 'baseui/typography'

import type { Credential } from '../../../types'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCredentials } from './CredentialsContext'

interface LocationState {
  credentialUUID: string | undefined
}

const AddCredential: React.FC = () => {
  const [credentialUUID, setCredentialUUID] = useState<string | undefined>(undefined)
  const [formData, setFormData] = useState<Credential>({
    website: '',
    username: '',
    password: ''
  })
  const [css] = useStyletron()
  const navigate = useNavigate()
  const { credentials, updateCredential } = useCredentials()

  const location = useLocation()
  useEffect(() => {
    if (location.state !== null && 'credentialUUID' in location.state) {
      const { credentialUUID: stateCredentialUUID } = location.state as LocationState
      if (stateCredentialUUID !== undefined) {
        setFormData(credentials[stateCredentialUUID])
        setCredentialUUID(stateCredentialUUID)
      }
    }
  }, [location])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    updateCredential(formData, credentialUUID)
    navigate('/passwordmanager')
  }

  const handleDelete = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    updateCredential(undefined, credentialUUID)
    navigate('/passwordmanager')
  }

  const handleGenerate = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    let maybeNewCredentialUUID = credentialUUID
    if (credentialUUID === undefined) {
      if (formData.password !== '' || formData.username !== '' || formData.website !== '') {
        maybeNewCredentialUUID = updateCredential(formData, credentialUUID)
        setCredentialUUID(maybeNewCredentialUUID)
      }
    }
    navigate('/passwordmanager/generate', { state: { credentialUUID: maybeNewCredentialUUID } })
  }

  return <>
    <HeadingMedium className={css({ margin: '20px 0px 20px 80px' })}>Add Account:</HeadingMedium>
    <Block
      className={css({
        width: '300px',
        margin: 'auto'
      })}
    >
    <FormControl label="Website">
        <Input
          type="text"
          size={INPUT_SIZE.mini}
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl label="Username">
        <Input
          type="text"
          size={INPUT_SIZE.mini}
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl label="Password">
        <Input
          type="password"
          size={INPUT_SIZE.mini}
          endEnhancer={
            <Button
              size={BUTTON_SIZE.mini}
              shape={SHAPE.pill}
              onClick={handleGenerate}
            >Generate</Button>
          }
          overrides={ { Root: { style: { paddingRight: '0px' } } } }
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
        <Button onClick={handleSave} className={css({ padding: 'auto', margin: '0 50 0 50' })}>Save</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </Block>
    </Block>
  </>
}

export default AddCredential
