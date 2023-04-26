import { RequireAuth } from "./components/RequireAuth"
import { PersistLogin } from "./components/PersistLogin"
import { Route, Routes } from "react-router-dom"
import { RegisterForm } from "./pages/RegisterForm"
import { Login } from "./pages/Login"
import { ForgotPassword } from "./pages/ForgotPassword"
import { ResetPassword } from "./pages/ResetPassword"
import { PleaseConfirmEmail } from "./pages/PleaseConfirmEmail"
import { ConfirmEmail } from "./pages/ConfirmEmail"
import { RegistrationConfirmed } from "./pages/RegistrationConfirmed"
import { Account } from "./pages/Account"
import { UsersTable } from "./components/UsersTable"
import { NotFound } from "./pages/NotFound"
import { Admin } from "./pages/Admin"
import { Layout } from "./components/Layout"
import { Unauthorized } from "./pages/Unauthorized"
import { About } from "./pages/About"
import { Logout } from "./pages/Logout"
import { MyNotes } from "./pages/MyNotes"
import { TodaysNotes } from "./pages/TodaysNotes"
import { AddEditNote } from "./pages/AddEditNote"

const ROLES = {
  User: 1001,
  Admin: 2001,
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/registration_confirmed"
            element={<RegistrationConfirmed />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/unconfirmed" element={<PleaseConfirmEmail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/confirm/:token" element={<ConfirmEmail />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />

          {/* we want to protect these routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="/allnotes" element={<MyNotes />} />
              <Route path="/mynotes" element={<TodaysNotes />} />
              <Route path="/mynotes/:date" element={<TodaysNotes />} />
              <Route path="/add_note" element={<AddEditNote />} />
              <Route path="/edit_note/:noteId" element={<AddEditNote />} />
              <Route path="/account" element={<Account />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/users" element={<UsersTable />} />
            </Route>
          </Route>
          {/* catch all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
