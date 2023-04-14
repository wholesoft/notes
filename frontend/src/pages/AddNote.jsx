import { tabTitle } from "../utils/helperFunctions"
import { AddEditNoteForm } from "../components/AddEditNoteForm"
const AddNote = () => {
  return (
    <>
      {tabTitle("Add Note - Wholesoft Notes")}
      <AddEditNoteForm />
    </>
  )
}

export { AddNote }
