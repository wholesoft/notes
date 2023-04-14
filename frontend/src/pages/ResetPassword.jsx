import { UpdatePassword } from "../components/UpdatePassword"
import { useSearchParams } from "react-router-dom"
import { tabTitle } from "../utils/helperFunctions"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const password_reset_token = searchParams.get("id")
  //const password_reset_token = "XYZ";
  //console.log(password_reset_token)

  return (
    <>
      {tabTitle("Reset Password - Wholesoft Stuff")}
      <h1>Create a new password.</h1>
      <br />
      <UpdatePassword token={password_reset_token} />
    </>
  )
}

export { ResetPassword }
