import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUsers,
  deleteUser,
  editUserRoles,
  editUserEmail,
  confirmEmail,
} from "./apiUser"
import useAuth from "../../hooks/useAuth"

const useUsers = () => {
  const getQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  })
  return getQuery
}

const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: (user_id) => deleteUser(user_id),
    onMutate: async (props) => {
      console.log("on mutate")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["users"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return deleteMutation
}

const useEditUserEmail = (toastRef) => {
  const { auth, setAuth } = useAuth()
  let [updateAuthEmail, setUpdateAuthEmail] = useState(false)
  let [newEmail, setNewEmail] = useState("")
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editUserEmail(data),
    onMutate: async (props) => {
      console.log("ON MUTATE")
      console.log(props)
      setUpdateAuthEmail(false)
      setNewEmail("")
      if (props.user_id == auth.user_id) {
        setUpdateAuthEmail(true)
        setNewEmail(props.email)
        console.log("update_auth_email: " + updateAuthEmail)
      } else {
        console.log(
          `Edit User ID: ${props.user_id}, Auth User ID: ${auth.user_id}`
        )
      }
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log("update_auth_email2: " + updateAuthEmail)
      console.log(props)
      const { success, message } = props
      if (!success) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: message,
        })
      } else if (updateAuthEmail) {
        console.log("Updating Auth Email")
        //auth.email = newEmail

        setAuth((prev) => {
          return {
            ...prev,
            email: newEmail,
          }
        })
      }
      return queryClient.invalidateQueries(["users"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useEditUserRoles = () => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data) => editUserRoles(data),
    onMutate: async (props) => {
      console.log("on mutate name")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      return queryClient.invalidateQueries(["users"])
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

const useConfirmEmail = (setMessage, setSuccess) => {
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (token) => confirmEmail(token),
    onMutate: async (props) => {
      console.log("on mutate confirm email")
      console.log(props)
    },
    onSuccess: (props) => {
      console.log("mutate success")
      console.log(props)
      setMessage(props.message)
      setSuccess(props.success)
      queryClient.invalidateQueries(["users"])
      return props
    },
    onError: (props) => {
      console.log("mutate error")
    },
  })
  return editMutation
}

export {
  useUsers,
  useDeleteUser,
  useEditUserEmail,
  useEditUserRoles,
  useConfirmEmail,
}
