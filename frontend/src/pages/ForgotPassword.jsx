import { ForgotPasswordForm } from "../components/ForgotPasswordForm"
import { tabTitle } from "../utils/helperFunctions"

const ForgotPassword = () => {
  return (
    <>
      {tabTitle("Forgot Password - Wholesoft Stuff")}
      <ForgotPasswordForm />
    </>
  )
}

export { ForgotPassword }
