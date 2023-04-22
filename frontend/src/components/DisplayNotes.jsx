import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNotes, useDeleteNote } from "../data/notes/useNotes"

import { Toast } from "primereact/toast"
import { Card } from "primereact/card"

function formatDate(date_string) {
  let result = ""
  if (date_string != null) {
    result = new Date(date_string).toLocaleDateString()
  }
  return result
}

function formatDateTime(date_string) {
  // Should output in this format:
  // 6:59 AM 4/14/2023
  let result = ""
  if (date_string != null) {
    let dateString = new Date(date_string).toLocaleDateString()
    let timeString = new Date(date_string).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    result = `${timeString} ${dateString}`
  }
  return result
}

const DisplayNotes = () => {
  const toastRef = useRef()

  const notesQuery = useNotes()
  const deleteMutation = useDeleteNote(toastRef)

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
    return <Link to={`/notes/${id}`}>details</Link>
  }

  if (notesQuery.isLoading) return <h1>Loading...</h1>
  if (notesQuery.isError) {
    return <pre>{JSON.stringify(notesQuery.error)}</pre>
  }
  const data = notesQuery.data

  return (
    <>
      <div className="grid">
        {data.map((row) => {
          return (
            <div key={row.id} className="col-12 md:col-6 lg:col-3 xl: col-2">
              <Card
                title=""
                subTitle={formatDateTime(row.created)}
                className=""
                style={{ position: "relative" }}
              >
                <div>{row.note}</div>
                <div
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  <Link to={`/edit_note/${row.id}`}>
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

export { DisplayNotes }
