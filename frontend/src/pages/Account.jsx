import { UpdatePassword } from "../components/UpdatePassword"
import { UpdateEmailForm } from "../components/UpdateEmailForm"
import { tabTitle } from "../utils/helperFunctions"

const Account = () => {
  return (
    <>
      {tabTitle("Account - Wholesoft Notes")}
      <div className="flex flex-wrap">
        <UpdateEmailForm />
        <UpdatePassword />
      </div>
    </>
  )
}

export { Account }
