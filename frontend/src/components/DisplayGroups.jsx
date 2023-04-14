import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  useGroups,
  useDeleteGroup,
  useEditGroupName,
  useEditGroupNote,
} from "../data/stuff/useStuff"

import { Toast } from "primereact/toast"
import { Card } from "primereact/card"

function formatDate(date_string) {
  let result = ""
  if (date_string != null) {
    result = new Date(date_string).toLocaleDateString()
  }
  return result
}

const DisplayGroups = () => {
  const toastRef = useRef()

  const groupQuery = useGroups()
  const deleteMutation = useDeleteGroup(toastRef)
  //const editGroupNameMutation = useEditGroupName()
  //const editGroupNoteMutation = useEditGroupNote()

  const data = groupQuery.data

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
    return <Link to={`/stuff/${id}`}>details</Link>
  }

  if (groupQuery.isLoading) return <h1>Loading...</h1>
  if (groupQuery.isError) {
    return <pre>{JSON.stringify(groupQuery.error)}</pre>
  }
  return (
    <>
      <div className="grid">
        {data.map((row) => {
          return (
            <div key={row.id} className="col-12 md:col-6 lg:col-3 xl: col-2">
              <Card
                title={row.group_name}
                subTitle={row.notes}
                className=""
                style={{ position: "relative" }}
              >
                <Link to={`/stuff/${row.id}`}>{row.total_items} items</Link>
                <div
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  <Link to={`/edit_group/${row.id}`}>
                    <span className="pi pi-pencil"></span>
                  </Link>
                  <span
                    className="pi pi-trash ml-2"
                    onClick={(e) => {
                      deleteMutation.mutate(row.id)
                    }}
                  ></span>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
      <Toast ref={toastRef} />
    </>
  )
}

export { DisplayGroups }
