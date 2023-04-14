import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useConfirmEmail } from "../data/user/useUser"
import { tabTitle } from "../utils/helperFunctions"

const ConfirmEmail = () => {
  const { token } = useParams()
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const confirmEmailMutation = useConfirmEmail(setMessage, setSuccess)
  //const { isLoading, isSuccess, error, mutate } = useConfirmEmail()

  useEffect(() => {
    confirmEmailMutation.mutate(token)
  }, [])

  if (confirmEmailMutation.isLoading) return <h1>Loading...</h1>
  if (confirmEmailMutation.isError) {
    return <pre>{JSON.stringify(confirmEmailMutation.error)}</pre>
  }

  return success ? (
    <>
      {tabTitle("Confirm Email - Wholesoft Stuff")}
      <p>
        Thank you for confirming your email address. Please{" "}
        <Link to="/login">login</Link>.
      </p>
    </>
  ) : (
    <p>An Error occured. ({message})</p>
  )
}

export { ConfirmEmail }
