import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import AuthProvider, { useLoginFlow } from './features/Authentication/authContext'
import Login from './features/Authentication'
import Signup from './features/Authentication/pages/Signup'
import OTPVerificationPage from './features/Authentication/pages/OTPVerification'
import ChangePassword from './features/Authentication/pages/ChangePassword'
import SetupTwoFactorAuthentication from './features/Authentication/pages/Setup2FA'
import PasswordGenerator from './features/PasswordManager/PasswordGenerator'
import PasswordManager from './features/PasswordManager'
import AddCredential from './features/PasswordManager/AddCredential'

import { verifyOTPDummy } from '../api/dummyAPI'
import CredentialProvider from './features/PasswordManager/CredentialsContext'

const Loader: React.FC = () => {
  const { isLoggedIn } = useLoginFlow()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    } else {
      navigate('/passwordmanager')
    }
  }, [])
  return <h1>Loading Screen</ h1>
}

// const PasswordManagement: React.FC = () => {
//   return <CredentialProvider>
//     <Route path='/passwordmanager'>
//       <Route index element={<PasswordManager />} />
//       <Route path='add' element={<AddCredential />} />
//       <Route path='generate' element={<PasswordGenerator />} />
//     </Route>
//   </CredentialProvider>
// }

function App (): JSX.Element {
  return (
    <AuthProvider>
      <CredentialProvider>
        <Routes>
          <Route path='/' element={<Loader />} />
          <Route path='/changepassword' element={<ChangePassword ifSuccessGoTo='/passwordmanager' />} />
          <Route path='/login'>
            <Route index element={<Login />} />
            <Route path='verify' element={<OTPVerificationPage verifyOTPFn={verifyOTPDummy} ifVerifiedGoTo='/passwordmanager' />} />
          </Route>
            <Route path='/passwordmanager'>
              <Route index element={<PasswordManager />} />
              <Route path='add' element={<AddCredential />} />
              <Route path='generate' element={<PasswordGenerator />} />
            </Route>
          <Route path='/signup'>
            <Route index element={<Signup />} />
            <Route path='verifyemail' element={<OTPVerificationPage verifyOTPFn={verifyOTPDummy} ifVerifiedGoTo='/signup/createpassword' />} />
            <Route path='createpassword' element={<ChangePassword ifSuccessGoTo='/setup2fa' />} />
          </Route>
          <Route path='/setup2fa' element={<SetupTwoFactorAuthentication />} />
          <Route path='*' element={'Page Not Found'} />
        </Routes>
      </CredentialProvider>
    </AuthProvider>
  )
}

export default App
