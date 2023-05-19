import { useNavigate } from 'react-router-dom'
import { useStyletron } from 'baseui'
import { Block } from 'baseui/block'
import { Button, KIND, SIZE as BUTTON_SIZE } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { ChevronRight, Plus } from 'baseui/icon'
import { Input, SIZE as INPUT_SIZE } from 'baseui/input'
import { ListHeading, ListItem, ListItemLabel } from 'baseui/list'
import { LabelLarge } from 'baseui/typography'

import type { Credential } from '../../../types'
import { useCredentials } from './CredentialsContext'

interface PropsI {
  credentialUUID: string
  credential: Credential
}

const CredentialListItem: React.FC<PropsI> = (props: PropsI) => {
  const navigate = useNavigate()

  const handleEdit = (event: React.SyntheticEvent<HTMLButtonElement, Event>): void => {
    event.preventDefault()
    navigate('/passwordmanager/add', { state: { credentialUUID: props.credentialUUID } })
  }

  return <ListItem
    endEnhancer={() => (
    <Button
      size={BUTTON_SIZE.mini}
      kind={KIND.secondary}
      onClick={handleEdit}
    >Edit</Button>)}
  >
    <ListItemLabel description={
      <FormControl label={props.credential.username}>
        <Input
          type="password"
          size={INPUT_SIZE.mini}
          name="password"
          value={props.credential.password}
          overrides={{ Root: { style: { width: '250px' } } }}
          disabled
        />
      </FormControl>
    }>{props.credential.website}</ListItemLabel>
  </ListItem>
}

const PasswordManager: React.FC = () => {
  const [css, theme] = useStyletron()
  const navigate = useNavigate()

  const { credentials } = useCredentials()

  return <>
    <Block className={css({
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      margin: '15px'
    })}>
      <LabelLarge
      className={css({ marginTop: 'auto', marginBottom: 'auto' })}
      >Logged in as Vishal Haswani</LabelLarge>
      <Button>Logout</Button>
    </Block>
    <Block className={css({
      width: '400px',
      height: '300px',
      border: '2px solid ' + theme.colors.buttonSecondaryActive,
      margin: 'auto'
    })}>
      <ListHeading heading='Saved Passwords'/>
      <Block className={css({
        overflow: 'auto',
        height: 'calc(300px - 64px)'
      })}>
        {
          Object.keys(credentials).map((credentialUUID) => {
            return <CredentialListItem key={credentialUUID} credentialUUID={credentialUUID} credential={credentials[credentialUUID]} />
          })
        }
        <ListItem
          artwork={Plus}
          endEnhancer={() => <ChevronRight size={40}/>}
          overrides={
            {
              Root: {
                props: { onClick: () => navigate('/passwordmanager/add') },
                style: {
                  cursor: 'pointer',
                  ':hover': { background: theme.colors.buttonSecondaryActive },
                  ':active': { background: theme.colors.buttonSecondaryActive }
                }
              }
            }
          }
        >
          <ListItemLabel>Add Password</ListItemLabel>
        </ListItem>
      </Block>
    </Block>
  </>
}

export default PasswordManager
