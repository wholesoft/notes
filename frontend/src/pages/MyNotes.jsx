import { tabTitle } from "../utils/helperFunctions"
import { Link } from "react-router-dom"

const MyNotes = () => {
  return (
    <>
      {tabTitle("My Notes - Wholesoft Stuff")}
      <span className="text-sm">
        <Link to="/add_note">Add Note</Link>
      </span>
    </>
  )
}

export { MyNotes }
