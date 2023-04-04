import { useQuery } from '@tanstack/react-query'
import { setup2FactorAuthDummy, verifyOTPDummy } from '../../../../api/dummyAPI'
import OTPVerificationPage from './OTPVerification'

const SetupTwoFactorAuthentication: React.FC = () => {
  const qrCodeQuery = useQuery({
    queryFn: setup2FactorAuthDummy
  })

  const Message: React.FC = () => {
    return <>
      <center><img src={qrCodeQuery.data?.qrCodeSrc}></img></center>
      <br />
      Please scan the above QR Code through your prefered Authentictor App and enter the OTP generated through it.
    </>
  }

  return <>
    <OTPVerificationPage verifyOTPFn={verifyOTPDummy} ifVerifiedGoTo='/passwordmanager' message={<Message />} />
  </>
}

export default SetupTwoFactorAuthentication
