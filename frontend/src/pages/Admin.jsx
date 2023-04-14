import { UsersTable } from "../components/UsersTable"
import { tabTitle } from "../utils/helperFunctions"

const Admin = () => {
  return (
    <>
      {tabTitle("Admin - Wholesoft Stuff")}
      <h1>Admin Page</h1>
      <br />
      <UsersTable />
    </>
  )
}

export { Admin }
