import { axiosAuth } from "../axios"

const getUsers = async () => {
  const url = `/users`
  const response = await axiosAuth.get(url)
  return response.data
}

const deleteUser = async (user_id) => {
  const url = `/delete_user/${user_id}`
  const response = await axiosAuth.get(url)
  console.log(response.data)
  return response.data
}

const editUserRoles = async (props) => {
  console.log("editUserRoles")
  const { user_id, roles } = props
  const url = "/edit_user_roles"
  const data = JSON.stringify({ user_id, roles })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editUserEmail = async (props) => {
  console.log("editUserEmail")
  //const { user_id, email } = props
  const url = "/edit_user_email"
  //const data = JSON.stringify({ user_id, email })
  console.log(props)
  const response = await axiosAuth.post(url, props)
  //console.log(response.data)
  return response.data
}

const confirmEmail = async (token) => {
  const url = `/confirm/${token}`
  console.log(url)
  const response = await axiosAuth.get(url)
  console.log(response.data)
  return response.data
}

export { getUsers, deleteUser, editUserRoles, editUserEmail, confirmEmail }
