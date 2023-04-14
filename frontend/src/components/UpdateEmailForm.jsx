import { useState, useRef } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import useAuth from "../hooks/useAuth"
import { Card } from "primereact/card"

const UpdateEmailForm = () => {
  const { auth, setAuth } = useAuth()
  const [email, setEmail] = useState(auth.email)
  const toastRef = useRef()
  const axiosPrivate = useAxiosPrivate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.post(
        "/update_email_address",
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      console.log(JSON.stringify(response?.data))
      const message = response?.data?.message
      const success = response?.data?.success
      if (success) {
        setAuth((prev) => {
          return {
            ...prev,
            email: email,
          }
        })
      }
      toastRef.current.show({
        severity: "info",
        summary: success,
        detail: message,
      })
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
      <Card title="Update Email Address" className="mr-4 mb-4 col-12 md:col-5">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label mt-1">
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email:</label>
            </span>
          </div>
          <Button label="Update" icon="pi pi-check" className="mt-2" />
        </form>

        <Toast ref={toastRef} />
      </Card>
    </>
  )
}

export { UpdateEmailForm }
