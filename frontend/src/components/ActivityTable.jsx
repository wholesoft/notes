import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useUserActivityLog } from "../data/applog/useAppLog"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode, PrimeIcons } from "primereact/api"
import { Toast } from "primereact/toast"

function formatDate(dateString) {
  let result = ""
  if (dateString != null) {
    let timeString = new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    dateString = new Date(dateString).toLocaleDateString()
    result = `${dateString} ${timeString} `
  }
  return result
}

const ActivityTable = () => {
  const toastRef = useRef()

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const dataQuery = useUserActivityLog()

  const rowData = dataQuery.data

  let displayCreated = (rowData) => {
    let value = rowData.created
    return formatDate(value)
  }

  let displayDetails = (rowData) => {
    let id = rowData.id
    if (rowData.event != "Note Deleted") {
      return <Link to={`/edit_note/${id}`}>details</Link>
    }
  }

  let size = "small"
  if (dataQuery.isLoading) return <h1>Loading...</h1>
  if (dataQuery.isError) {
    return <pre>{JSON.stringify(dataQuery.error)}</pre>
  }
  console.log(rowData)
  return (
    <>
      <div>
        <h2>Activity Log</h2>
      </div>
      <DataTable
        value={rowData}
        showGridlines
        stripedRows
        size={size}
        filters={filters}
        tableStyle={{ minWidth: "30rem" }}
      >
        <Column
          field="created"
          header="Created"
          sortable
          body={displayCreated}
        />
        <Column field="event" header="Event" sortable />
        <Column field="note_id" header="Note" body={displayDetails} sortable />
      </DataTable>
      <Toast ref={toastRef} />
    </>
  )
}

export { ActivityTable }
