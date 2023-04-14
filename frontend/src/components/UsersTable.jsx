import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  useUsers,
  useDeleteUser,
  useEditUserRoles,
  useEditUserEmail,
} from "../data/user/useUser"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode, PrimeIcons } from "primereact/api"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"

function formatDate(date_string) {
  let result = ""
  if (date_string != null) {
    result = new Date(date_string).toLocaleDateString()
  }
  return result
}

const UsersTable = () => {
  const toastRef = useRef()

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const usersQuery = useUsers()
  const deleteUserMutation = useDeleteUser()
  const editUserEmailMutation = useEditUserEmail(toastRef)
  const editUserRolesMutation = useEditUserRoles()

  const rowData = usersQuery.data

  const deleteColumn = (rowData) => {
    return (
      <div className="deleteAction">
        <span className="actionIcons delete-role">
          <i
            id="link_delete"
            className={PrimeIcons.TRASH}
            title={"delete"}
            aria-hidden="true"
            onClick={(e) => {
              //console.log(`DELETE ACTION ${rowData.id}`);
              deleteUserMutation.mutate(rowData.id)
            }}
          />
        </span>
      </div>
    )
  }

  const onCellEditChange = (options) => (event) => {
    options.editorCallback(event.target.value)
  }
  const cellEditor = (options) => {
    return (
      <InputText value={options.value} onChange={onCellEditChange(options)} />
    )
  }
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e
    let user_id = rowData["id"]
    console.log(`EDIT CELL (${field}) COMPLETE: ${newValue}, ID: ${user_id}`)
    if (field == "roles") {
      editUserRolesMutation.mutate({ user_id: user_id, roles: newValue })
    }
    if (field == "email") {
      editUserEmailMutation.mutate({ user_id: user_id, email: newValue })
    }
  }

  let displayLastLogin = (rowData) => {
    let value = rowData.last_login
    return formatDate(value)
  }

  let displayEmailConfirmed = (rowData) => {
    let value = rowData.email_confirmed
    return formatDate(value)
  }

  let displayUpdated = (rowData) => {
    let value = rowData.updated
    return formatDate(value)
  }

  let displayCreated = (rowData) => {
    let value = rowData.created
    return formatDate(value)
  }

  let displayDetails = (rowData) => {
    let id = rowData.id
    return <Link to={`/user/${id}`}>details</Link>
  }

  let size = "small"
  if (usersQuery.isLoading) return <h1>Loading...</h1>
  if (usersQuery.isError) {
    return <pre>{JSON.stringify(usersQuery.error)}</pre>
  }
  return (
    <>
      <InputText
        onInput={(e) =>
          setFilters({
            global: {
              value: e.target.value,
              matchMode: FilterMatchMode.CONTAINS,
            },
          })
        }
      />

      <DataTable
        value={rowData}
        showGridlines
        stripedRows
        size={size}
        filters={filters}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="id" header="ID" sortable />
        <Column
          field="email"
          header="Email"
          sortable
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />

        <Column
          field="roles"
          header="Roles"
          sortable
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column
          field="last_login"
          header="Last Login"
          sortable
          body={displayLastLogin}
        />
        <Column field="n_logins" header="Total Logins" sortable />
        <Column
          field="email_confimed"
          header="Email Confirmed"
          sortable
          body={displayEmailConfirmed}
        />

        <Column
          field="created"
          header="Created"
          sortable
          body={displayCreated}
        />

        <Column body={deleteColumn} />
        {/* <Column body={displayDetails} /> */}
      </DataTable>
      <Toast ref={toastRef} />
    </>
  )
}

export { UsersTable }
