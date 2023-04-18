import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  getNote,
  getNotes,
  deleteNote,
  addNote,
  editNote,
  getNoteDates,
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
      //console.log(props)
      toastRef.current.show({
        severity: "info",
        summary: "Saved",
        detail: "Note Saved.",
      })
      navigate("/mynotes") // TODO: display toast message after navigating
      return queryClient.invalidateQueries(["groups"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

export {
  useNotes,
  useNote,
  useEditNote,
  useDeleteNote,
  useAddNote,
  useNoteDates,
}
