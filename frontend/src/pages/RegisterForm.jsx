import { useState, useRef } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { NavLink, useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Password } from "primereact/password"
import { tabTitle } from "../utils/helperFunctions"

const RegisterForm = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const toastRef = useRef()
  const axiosPrivate = useAxiosPrivate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.post(
        "/register",
        JSON.stringify({ email, password, confirm_password: confirmPassword }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))
      const message = response?.data?.message
      const success = response?.data?.success
      toastRef.current.show({
        severity: "info",
        summary: success,
        detail: message,
      })
      if (success) {
        navigate("/registration_confirmed")
      }
    } catch (err) {
      console.log("ERROR FOUND")
      console.log(err.message)
      if (!err?.response) {
        toastRef.current.show({
          severity: "info",
          summary: "Error",
          detail: "No Server Response.",
        })
        console.log("NO RESPONSE")
      } else if (err.response?.status === 400) {
        toastRef.current.show({
          severity: "info",
          summary: "Error",
          detail: "Missing Email.",
        })
        console.log("MISSING EMAIL")
      } else {
        toastRef.current.show({
          severity: "info",
          summary: "Error",
          detail: "Unauthorized.",
        })
        console.log("UNAUTHORIZED")
      }
    }
  }

  return (
    <>
      {tabTitle("Register - Wholesoft Stuff")}
      <Card title="Register" className="mr-4 mb-4 col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label mt-2">
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
              />
              <label htmlFor="email">Email</label>
            </span>

            <span className="p-float-label mt-5">
              <Password
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                feedback={false}
                toggleMask
                required
              />
              <label htmlFor="password">Password</label>
            </span>

            <span className="p-float-label mt-5">
              <Password
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                feedback={false}
                toggleMask
                required
              />
              <label htmlFor="confirm_password">Confirm Password</label>
            </span>
          </div>
          <Button label="Submit" icon="pi pi-check" className="mt-2" />
        </form>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { RegisterForm }
