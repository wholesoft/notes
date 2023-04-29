import { tabTitle } from "../utils/helperFunctions"
import { AddEditNoteForm } from "../components/AddEditNoteForm"
import { useParams } from "react-router-dom"
import { useNote, useTags } from "../data/notes/useNotes"

const AddEditNote = () => {
  const params = useParams()
  //console.log(params)
  let note_id = 0
  if (params.noteId != undefined) {
    note_id = Number(params.noteId)
  }

  const dataTags = useTags()
  const dataQuery = useNote(note_id)

  let pageTitle = "Add Item - Wholesoft Notes"
  if (note_id > 0) {
    pageTitle = "Edit Item - Wholesoft Notes"
  }

  if (
    dataQuery.isLoading ||
    dataQuery.isFetching ||
    dataTags.isLoading ||
    dataTags.isFetching
  )
    return <h1>Loading...</h1>
  if (dataQuery.isError || dataTags.isError) {
    return <pre>{JSON.stringify(dataQuery.error)}</pre>
  }

  if (dataQuery.data != undefined) {
    note_id = dataQuery.data.note_id
  }
  console.log("AddEditNote Render")
  return (
    <>
      {tabTitle(pageTitle)}
      <AddEditNoteForm data={dataQuery.data} tags={dataTags.data} />
    </>
  )
}

export { AddEditNote }
