import React, { useState } from 'react'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { Block } from 'baseui/block'
import { Slider, Params as SliderOnChangeParams } from 'baseui/slider'
import {
  Checkbox,
  LABEL_PLACEMENT
} from 'baseui/checkbox'

interface FormData {
  length: number
  includeLowercase: boolean
  includeUppercase: boolean
  includeNumbers: boolean
  includeSpecial: boolean
}

const characters = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  special: '!@#$%^&*()_+-=[]{}\\|;:\'",.<>?/'
}

const generatePassword = (formData: FormData): string => {
  let password = ''
  const possibleCharacters = []

  if (formData.includeLowercase) {
    possibleCharacters.push(characters.lowercase)
  }
  if (formData.includeUppercase) {
    possibleCharacters.push(characters.uppercase)
  }
  if (formData.includeNumbers) {
    possibleCharacters.push(characters.numbers)
  }
  if (formData.includeSpecial) {
    possibleCharacters.push(characters.special)
  }

  const possibleCharactersString = possibleCharacters.join('')

  for (let i = 0; i < formData.length; i++) {
    password += possibleCharactersString[Math.floor(Math.random() * 100) % possibleCharactersString.length]
  }

  return password
}

const PasswordGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    length: 12,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSpecial: true
  })
  const [password, setPassword] = useState(generatePassword(formData))
  const [css] = useStyletron()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    setPassword(generatePassword(formData))
  }

  const handleLengthChange = (newValue: SliderOnChangeParams): void => {
    setFormData({ ...formData, length: newValue.value[0] })
  }

  return (
    <Block className={css({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100vh',
      width: '70vw',
      marginLeft: 'auto',
      marginRight: 'auto'
    })}
    >
      <FormControl label="Length">
        <Slider
          value={[formData.length]}
          onChange={handleLengthChange}
          min={8}
          max={32}
        />
      </FormControl>
      <Block>
      <Checkbox
        name="includeLowercase"
        checked={formData.includeLowercase}
        onChange={handleChange}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        Lowercase
      </Checkbox>
      <Checkbox
        name="includeUppercase"
        checked={formData.includeUppercase}
        onChange={handleChange}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        Include uppercase
      </Checkbox>
      <Checkbox
        name="includeNumbers"
        checked={formData.includeNumbers}
        onChange={handleChange}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        Include numbers
      </Checkbox>
      <Checkbox
        name="includeSpecial"
        checked={formData.includeSpecial}
        onChange={handleChange}
        labelPlacement={LABEL_PLACEMENT.right}
      >
        Include special
      </Checkbox>
      </Block>
      <Button className={css({ borderTop: 'scale800' })} onClick={handleSubmit}>Generate Password</Button>
      <Block marginTop="scale800">
        <Input
          type="text"
          value={password}
          readOnly
          overrides={{
            Input: {
              style: {
                fontFamily: 'monospace'
              }
            }
          }}
        />
      </Block>
    </Block>
  )
}

export default PasswordGenerator
