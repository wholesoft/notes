import { useState, useRef, useEffect } from "react"
import {
  useAddGroup,
  useEditGroup,
  useDeleteGroup,
} from "../data/stuff/useStuff"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"
import { Checkbox } from "primereact/checkbox"

const AddEditGroupForm = (props) => {
  const toastRef = useRef()
  const addGroupMutation = useAddGroup(toastRef)
  const editGroupMutation = useEditGroup(toastRef)
  const deleteGroupMutation = useDeleteGroup(toastRef)

  const [deleteCheck, setDeleteCheck] = useState(false)

  let id = 0
  let group_name = ""
  let notes = ""

  //console.log(props.data)
  if (props.data != undefined) {
    id = props.data.id
    group_name = props.data.group_name
    if (props.data.notes != null) {
      notes = props.data.notes
    }
  }
  let cardTitle = "Add Group"
  if (id > 0) {
    cardTitle = "Edit Group"
  }

  const [form, setForm] = useState({
    group_name: group_name,
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
    const { group_name, notes } = form
    if (id > 0) {
      if (deleteCheck) {
        deleteGroupMutation.mutate(id)
      } else {
        editGroupMutation.mutate({ group_id: id, group_name, notes })
      }
    } else {
      addGroupMutation.mutate({ group_name, notes })
    }
    //setForm({ group: "", notes: "" })
  }

  return (
    <>
      <Card title={cardTitle} className="col-12 md:col-6">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <span className="p-float-label">
              <InputText
                id="group_name"
                type="text"
                value={form.group_name}
                onChange={(e) => handleChange(e)}
                autoComplete="off"
              />
              <label htmlFor="group">Group Name</label>
            </span>

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
            {/*
            <div className="mt-2">
              <Checkbox
                inputId="deleteGroup"
                onChange={(e) => setDeleteCheck(e.checked)}
                checked={deleteCheck}
              ></Checkbox>
              <label htmlFor="deleteGroup" className="ml-2">
                Delete Item
              </label>
            </div>
              */}
          </div>

          <Button className="mt-3" icon="pi pi-check" label="Save" />
        </form>
      </Card>
      <Toast ref={toastRef} />
    </>
  )
}

export { AddEditGroupForm }
