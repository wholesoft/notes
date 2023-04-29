import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  getNote,
  getNotes,
  deleteNote,
  addNote,
  editNote,
  getNoteDates,
  getTags,
} from "./apiNotes"

/* GROUPS */

const useNote = (note_id) => {
  const selectQuery = useQuery({
    queryKey: ["notes", note_id],
    queryFn: () => getNote(note_id),
    refetchOnReconnect: false,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  })
  return selectQuery
}

const useNotes = () => {
  const selectQuery = useQuery({
    queryKey: ["notes"],
    queryFn: () => getNotes(),
  })
  return selectQuery
}

const useNoteDates = () => {
  const selectQuery = useQuery({
    queryKey: ["note_dates"],
    queryFn: () => getNoteDates(),
  })
  return selectQuery
}

const useDeleteNote = (toastRef) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const deleteNoteMutation = useMutation({
    mutationFn: (note_id) => deleteNote(note_id),
    onMutate: async (props) => {
      console.log("on mutate")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      const { success, message } = props
      if (success) {
        queryClient.invalidateQueries(["notes"])
        navigate("/mynotes")
      }
      if (!success) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: message,
        })
      }
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return deleteNoteMutation
}

const useAddNote = (toastRef) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const addMutation = useMutation({
    mutationFn: (data) => addNote(data),
    onMutate: async (props) => {
      //console.log("on mutate")
      //console.log(props)
    },
    onSuccess: (props) => {
      //console.log("mutate success")
      //console.log(props)
      toastRef.current.show({
        severity: "info",
        summary: "Saved",
        detail: "Note Saved.",
      })
      queryClient.invalidateQueries(["notes"])
      navigate("/mynotes") // TODO: display toast message after navigating
    },
    onError: (props) => {
      console.log(props)
      console.log("mutate error")
    },
  })
  return addMutation
}

const useEditNote = (toastRef) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editNote(data),
    onMutate: async (props) => {
      console.log("on mutate note")
    },
    onSuccess: (props) => {
      //console.log("mutate success")
      console.log(props.data)
      toastRef.current.show({
        severity: "info",
        summary: "Saved",
        detail: "Note Saved.",
      })
      // need to set the date to whatever the edit does is
      let note_date = props.data.note.created_usertime.slice(0, 10) // yyyy-mm-dd
      //console.log(note_date)
      queryClient.invalidateQueries(["notes"])
      navigate(`/mynotes/${note_date}`) // TODO: display toast message after navigating
    },
    onError: (props) => {
      console.log(props)
      console.log("mutate error")
    },
  })
  return editMutation
}

const useTags = () => {
  const selectQuery = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  })
  return selectQuery
}

export {
  useNotes,
  useNote,
  useEditNote,
  useDeleteNote,
  useAddNote,
  useNoteDates,
  useTags,
}
