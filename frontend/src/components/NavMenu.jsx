import { useState } from "react"
import { Menu } from "primereact/menu"
import { useNavigate, Link } from "react-router-dom"
import useLogout from "../hooks/useLogout"
import useAuth from "../hooks/useAuth"

const NavMenu = () => {
  const navigate = useNavigate()
  const logout = useLogout()
  const { auth } = useAuth()

  const signOut = async () => {
    await logout()
    navigate("/")
  }

  //{ id: 1, link: "/", label: "Home" },

  // NOT LOGGED IN
  let items = [
    { id: 2, link: "/login", label: "Login" },
    { id: 3, link: "/register", label: "Register" },
  ]

  // LOGGED IN USER
  if (auth?.roles?.includes(1001)) {
    items = [
      { id: 4, link: "/mynotes", label: "My Notes" },
      { id: 5, link: "/account", label: "My Account" },
      { id: 6, link: "/logout", label: "Logout" },
    ]
  }
  //signOut()
  //hideSidebar()

  // ADMIN
  if (auth?.roles?.includes(2001)) {
    items.push({ id: 7, link: "/admin", label: "Admin" })
  }

  return (
    <>
      <ul>
        {items.map((item) => {
          return (
            <li key={item.id}>
              <Link to={item.link}>{item.label}</Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export { NavMenu }
