import { tabTitle } from "../utils/helperFunctions"
import { Link } from "react-router-dom"
import { DisplayDaysNotes } from "../components/DisplayDaysNotes"
import { HeavenGraph } from "../components/HeavenGraph"

const TodaysNotes = () => {
  return (
    <>
      {tabTitle("My Notes - Wholesoft Notes")}

      <div className="flex align-items-center text-blue-600">
        <Link to="/add_note">
          <i
            className="pi pi-plus-circle p-2 text-blue-600"
            style={{ fontSize: "2.5rem" }}
          ></i>
        </Link>{" "}
        <Link
          to="/add_note"
          className="text-blue-600"
          style={{ textDecoration: "none" }}
        >
          <span>New Note</span>
        </Link>
      </div>

      <DisplayDaysNotes />

      <HeavenGraph />
    </>
  )
}

export { TodaysNotes }
