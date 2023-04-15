import { tabTitle } from "../utils/helperFunctions"
import { Link } from "react-router-dom"
import { DisplayDaysNotes } from "../components/DisplayDaysNotes"

const TodaysNotes = () => {
  return (
    <>
      {tabTitle("My Notes - Wholesoft Notes")}
      <p className="text-sm">
        <Link to="/add_note">Add Note</Link>
      </p>
      <DisplayDaysNotes />
    </>
  )
}

export { TodaysNotes }
