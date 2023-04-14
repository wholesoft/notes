import { tabTitle } from "../utils/helperFunctions"
import { Link } from "react-router-dom"
import { DisplayNotes } from "../components/DisplayNotes"

const MyNotes = () => {
  return (
    <>
      {tabTitle("My Notes - Wholesoft Stuff")}
      <p className="text-sm">
        <Link to="/add_note">Add Note</Link>
      </p>
      <DisplayNotes />
    </>
  )
}

export { MyNotes }
