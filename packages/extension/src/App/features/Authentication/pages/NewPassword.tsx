import { useState } from 'react'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { Block } from 'baseui/block'

const ConfirmPasswordPage = (): JSX.Element => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [css] = useStyletron()

  const handleSubmit = (event: React.FormEvent): void => {
    // this should be an async function
    console.log(event)
  }

  return (
    <form>
      <Block className={css({ display: 'flex', flexDirection: 'column', alignItems: 'center' })}>
        <FormControl label="Password">
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl label="Confirm Password">
          <Input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.currentTarget.value)}
          />
        </FormControl>
        <Button type="submit" onClick={handleSubmit}>
          Confirm
        </Button>
      </Block>
    </form>
  )
}

export default ConfirmPasswordPage
