import * as React from "react"
import axios from "../api/axios"
import { tabTitle } from "../utils/helperFunctions"

const PleaseConfirmEmail = () => {
  const [email, setEmail] = React.useState(
    localStorage.getItem("unconfirmed_email")
  )
  const [message, setMessage] = React.useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        "/resend_email_confirmation_request",
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      console.log(JSON.stringify(response?.data))
      const success = response?.data?.success
      const response_message = response?.data?.message
      console.log(success)
      console.log(response_message)
      setMessage(response_message)
      if (success) {
        //localStorage.setItem("unconfirmed_email", "");
        setEmail("")

        //navigate('/unconfirmed');
      } else {
        //
      }
    } catch (err) {
      console.log("ERROR FOUND")
      if (!err?.response) {
        setErrMsg("No Server Response")
        console.log("NO RESPONSE")
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password")
        console.log("MISSING EMAIL OR PASSWORD")
      } else if (err.response?.staus === 401) {
        setErrMsg("Unauthorized")
        console.log("UNAUTHORIZED")
      } else {
        setErrMsg("Login Failed")
        console.log("LOGIN FAILED")
      }
      //errRef.current.focus();
    }
  }

  return (
    <>
      {tabTitle("Please Confirm Email - Wholesoft Stuff")}
      <p>{message}</p>
      <p>Please check your email and confirm your email before logging in.</p>
      <p>
        Don't see it? Check your spam folder or request it to be sent again.
      </p>
      <form onSubmit={handleSubmit}>
        <p>Registration Email: {email}</p>
        <button>Resend Confirmation Email</button>
      </form>
    </>
  )
}

export { PleaseConfirmEmail }
