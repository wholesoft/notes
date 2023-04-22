import { UpdatePassword } from "../components/UpdatePassword"
import { UpdateEmailForm } from "../components/UpdateEmailForm"
import { ActivityTable } from "../components/ActivityTable"
import { tabTitle } from "../utils/helperFunctions"

const Account = () => {
  return (
    <>
      {tabTitle("Account - Wholesoft Notes")}
      <div className="flex flex-wrap justify-content-center">
        <UpdateEmailForm />
        <UpdatePassword />
      </div>
      <div className="flex flex-column justify-content-center">
        <ActivityTable />
      </div>
    </>
  )
}

export { Account }
