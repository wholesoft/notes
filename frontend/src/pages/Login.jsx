import { useState, useRef, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "../api/axios"
import { Password } from "primereact/password"
import { InputText } from "primereact/inputtext"
import { Checkbox } from "primereact/checkbox"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Toast } from "primereact/toast"
import { tabTitle } from "../utils/helperFunctions"

const LOGIN_URL = "/auth"

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth()
  const toastRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))
      const access_token = response?.data?.access_token
      const roles = response?.data?.roles
      const email_confirmed = response?.data?.email_confirmed
      const user_id = response?.data?.user_id
      console.log("LOGIN RESPONSE")
      console.log(JSON.stringify(response?.data))
      if (!email_confirmed) {
        setAuth({})
        localStorage.setItem("unconfirmed_email", email)
        setEmail("")
        setPassword("")
        navigate("/unconfirmed")
      } else {
        setAuth({ user_id: user_id, email: email, roles, access_token })
        setEmail("")
        setPassword("")
        navigate(from, { replace: true })
      }
    } catch (err) {
      let error_message = ""
      console.log("ERROR FOUND")
      if (!err?.response) {
        error_message = "No Server Response"
      } else if (err.response?.status === 400) {
        error_message = "Missing Email or Password"
      } else if (err.response?.staus === 401) {
        error_message = "Unauthorized"
      } else {
        error_message = "Login Failed"
      }
      setErrMsg(error_message)
      toastRef.current.show({
        severity: "info",
        summary: "Login Failed",
        detail: error_message,
      })
      setEmail("")
      setPassword("")
    }
  }

  const togglePersist = () => {
    setPersist((prev) => !prev)
  }

  useEffect(() => {
    localStorage.setItem("persist", persist)
  }, [persist])

  return (
    <>
      {tabTitle("Login - Wholesoft Stuff")}
      <Card title="Sign In" className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label">
              <InputText
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                autoComplete="off"
              />
              <label htmlFor="enauk">Email</label>
            </span>

            <span className="p-float-label mt-4">
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                feedback={false}
                toggleMask
                required
                data-lpignore="true"
              />
              <label htmlFor="password">Password</label>
            </span>

            <div className="flex align-items-center mt-3 pl-1">
              <Checkbox
                inputId="persist"
                onChange={togglePersist}
                checked={persist}
              ></Checkbox>
              <label htmlFor="persist">&nbsp;Trust this device</label>
            </div>
          </div>
          <Button label="Sign In" icon="pi pi-check" className="mt-3" />

          <div className="flex flex-wrap text-sm">
            <p>
              <Link to="/forgot">Forgot Password?</Link>
            </p>
            <p className="pl-3">
              <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { Login }
