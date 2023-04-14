import { useState, useRef } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { Password } from "primereact/password"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
/*

This form used by both the User Account page and the Password Reset page.
The Account page requires that the user is logged in and passes the JWT token to the backend.
The Password reset page doesn't require that they are logged in (they forgot the password and 
so are unable to do so) but they need a password_reset_token that was emailed to them.
*/

const UpdatePassword = (props) => {
  const [password, setPassword] = useState("")
  const [confirm_password, setConfirmPassword] = useState("")
  const [responseMessage, setResponseMessage] = useState("")
  const axiosPrivate = useAxiosPrivate()
  const toastRef = useRef()
  let password_reset_token = ""
  if (props.token !== undefined) {
    password_reset_token = props.token
  }
  console.log(password_reset_token)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResponseMessage("")
    try {
      let response = ""
      if (password_reset_token == "") {
        response = await axiosPrivate.post(
          "/update_password",
          JSON.stringify({ password, confirm_password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      } else {
        response = await axiosPrivate.post(
          "/update_password_with_token",
          JSON.stringify({ password_reset_token, password, confirm_password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        )
      }
      console.log(JSON.stringify(response?.data))
      const message = response?.data?.message
      const success = response?.data?.success
      toastRef.current.show({
        severity: "info",
        summary: success,
        detail: message,
      })
      setResponseMessage(message)
      //navigate(from, {replace: true });
    } catch (err) {
      console.log("ERROR FOUND")
      console.log(err.message)
      if (!err?.response) {
        setResponseMessage("No Server Response")
        console.log("NO RESPONSE")
      } else {
        setResponseMessage("Unauthorized")
        console.log("UNAUTHORIZED")
      }
    }
  }

  return (
    <>
      <Card title="Update Password" className="mr-4 mb-4 col-12 md:col-5">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label mt-1">
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                feedback={false}
                toggleMask
                required
              />
              <label htmlFor="password">Password</label>
            </span>

            <br />

            <span className="p-float-label mt-3">
              <Password
                id="confirm_password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                feedback={false}
                toggleMask
                required
              />
              <label htmlFor="confirm_password">Confirm Password</label>
            </span>
          </div>
          <Button label="Update" icon="pi pi-check" className="mt-2" />
        </form>
        <Toast ref={toastRef} />
        <p>{responseMessage}</p>
      </Card>
    </>
  )
}

export { UpdatePassword }
