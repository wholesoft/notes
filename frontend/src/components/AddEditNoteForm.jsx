import { useState, useRef, useEffect } from "react"
import { useAddNote, useEditNote, useDeleteNote } from "../data/notes/useNotes"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Checkbox } from "primereact/checkbox"
import { Slider } from "primereact/slider"

function get_local_mysql_datetime() {
  // current datetime in mysql format
  // YYYY-MM-DD HH:MM:SS
  var d = new Date()
  var datestring =
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2) +
    " " +
    ("0" + d.getHours()).slice(-2) +
    ":" +
    ("0" + d.getMinutes()).slice(-2) +
    ":" +
    ("0" + d.getSeconds()).slice(-2)
  return datestring
}

function get_local_timezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

const AddEditNoteForm = (props) => {
  const toastRef = useRef()
  const addMutation = useAddNote(toastRef)
  const editMutation = useEditNote(toastRef)
  const deleteMutation = useDeleteNote(toastRef)

  const [deleteCheck, setDeleteCheck] = useState(false)
  //const [rating, setRating] = useState(0)

  let id = 0

  let note = ""
  let rating = 0
  //console.log(props)
  if (props.data != undefined) {
    id = props.data.id
    note = props.data.note
    rating = props.data.rating
    console.log(rating)
    if (rating == null) {
      rating = 0
    }
  }

  let cardTitle = "Add Note"
  if (id > 0) {
    cardTitle = "Edit Note"
  }

  const [form, setForm] = useState({
    note: note,
    rating: rating,
  })

  //console.log(`Note value is now: ${note}`)
  //console.log(`Form Note value is now: ${form.note}`)

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    })
  }

  const handleRatingChange = (new_rating) => {
    setForm({
      ...form,
      rating: new_rating,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    let response = ""
    const { note, rating } = form
    if (id > 0) {
      if (deleteCheck) {
        deleteMutation.mutate(id)
      } else {
        editMutation.mutate({ note_id: id, note, rating })
      }
    } else {
      const local_time = get_local_mysql_datetime()
      const timezone = get_local_timezone()
      addMutation.mutate({ note, local_time, timezone, rating })
    }
    //setForm({ group: "", notes: "" })
  }

  return (
    <>
      <Card title={cardTitle} className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label mt-0">
              <InputTextarea
                id="note"
                value={form.note}
                onChange={(e) => handleChange(e)}
                rows={5}
                cols={30}
              />
              <label htmlFor="notes">Note</label>
            </span>
          </div>

          <div className="p-fluid mt-4">
            <span className="p-float-label mt-0">
              <InputText
                id="rating"
                value={form.rating}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="w-full"
              />
              <Slider
                value={form.rating}
                onChange={(e) => handleRatingChange(e.value)}
                min={-100}
                max={100}
                className="w-full"
              />
              <label htmlFor="rating">Rating</label>
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
