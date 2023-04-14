import { useState, useRef, useEffect } from "react"
import { useAddNote, useEditNote, useDeleteNote } from "../data/notes/useNotes"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Checkbox } from "primereact/checkbox"

const AddEditNoteForm = (props) => {
  const toastRef = useRef()
  const addMutation = useAddNote(toastRef)
  const editMutation = useEditNote(toastRef)
  const deleteMutation = useDeleteNote(toastRef)

  const [deleteCheck, setDeleteCheck] = useState(false)

  let id = 0

  let notes = ""

  //console.log(props.data)
  if (props.data != undefined) {
    id = props.data.id
    if (props.data.notes != null) {
      notes = props.data.notes
    }
  }
  let cardTitle = "Add Note"
  if (id > 0) {
    cardTitle = "Edit Note"
  }

  const [form, setForm] = useState({
    notes: notes,
  })

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let response = ""
    const { notes } = form
    if (id > 0) {
      if (deleteCheck) {
        deleteMutation.mutate(id)
      } else {
        editMutation.mutate({ id: id, notes })
      }
    } else {
      addMutation.mutate({ notes })
    }
    //setForm({ group: "", notes: "" })
  }

  return (
    <>
      <Card title={cardTitle} className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label mt-4">
              <InputTextarea
                id="notes"
                value={form.notes}
                onChange={(e) => handleChange(e)}
                rows={5}
                cols={30}
              />
              <label htmlFor="notes">Notes</label>
            </span>
          </div>

          <Button className="mt-3" icon="pi pi-check" label="Save" />
        </form>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { AddEditNoteForm }
