import { tabTitle } from "../utils/helperFunctions"
import { useNavigate } from "react-router-dom"
import useLogout from "../hooks/useLogout"
import { useEffect } from "react"

const Logout = () => {
  const navigate = useNavigate()
  const logout = useLogout()

  useEffect(() => {
    logout()
    navigate("/about")
  }, [])

  return <>{tabTitle("Logout - Wholesoft Stuff")}</>
}

export { Logout }
