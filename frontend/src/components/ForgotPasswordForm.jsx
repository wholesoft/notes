import { useState, useRef, useEffect } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { InputText } from "primereact/inputtext"
import { Checkbox } from "primereact/checkbox"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Toast } from "primereact/toast"

const ForgotPasswordForm = () => {
  const axiosPrivate = useAxiosPrivate()
  const toastRef = useRef()
  const [responseMessage, setResponseMessage] = useState("")
  const [form, setForm] = useState({
    email: "",
  })

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResponseMessage("")
    try {
      const { email } = form
      const response = await axiosPrivate.post(
        "/reset_password_email_request",
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))
      const message = response?.data?.message
      setResponseMessage(message)
      toastRef.current.show({
        severity: "info",
        summary: "Info",
        detail: message,
      })
      setForm({ email: "" })
      //navigate(from, {replace: true });
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
    }
  }

  return (
    <>
      <Card
        title="Reset Password"
        subTitle="Enter the email used to create the account and we'll send you a link to reset your password."
        className="col-12 md:col-8 lg:col-6"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label">
              <InputText
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="group">Email</label>
            </span>
          </div>
          <Button icon="pi pi-check" label="Send" className="mt-3" />
        </form>
        <p>{responseMessage}</p>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { ForgotPasswordForm }
