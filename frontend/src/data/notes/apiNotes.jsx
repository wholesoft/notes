import { axiosAuth } from "../axios"

const getNotes = async () => {
  const url = `/notes`
  const response = await axiosAuth.get(url)
  return response.data
}

const getNote = async (note_id) => {
  const url = `/notes/${note_id}`
  const response = await axiosAuth.get(url)
  //console.log(response.data)
  return response.data
}

const deleteNote = async (note_id) => {
  const url = `/delete_note`
  data = JSON.stringify(note_id)
  console.log(data)
  const response = await axiosAuth.post(url)
  console.log(response.data)
  return response.data
}

const addNote = async (data) => {
  const url = "/add_note"
  data = JSON.stringify(data)
  const response = await axiosAuth.post(url, data)
  console.log(response)
  return response
}

const editNote = async (data) => {
  console.log("editNote")
  const url = "/edit_note"
  data = JSON.stringify(data)
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

export { getNotes, getNote, deleteNote, addNote, editNote }
