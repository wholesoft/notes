import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNotes } from "../data/notes/useNotes"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode, PrimeIcons } from "primereact/api"
import { Toast } from "primereact/toast"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length

function cloneJSON(obj) {
  // basic type deep copy
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj
  }
  // array deep copy
  if (obj instanceof Array) {
    var cloneA = []
    for (var i = 0; i < obj.length; ++i) {
      cloneA[i] = cloneJSON(obj[i])
    }
    return cloneA
  }
  // object deep copy
  var cloneO = {}
  for (var i in obj) {
    cloneO[i] = cloneJSON(obj[i])
  }
  return cloneO
}

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

const HeavenGraph = () => {
  const toastRef = useRef()

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const dataQuery = useNotes()

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

  // Format query data for use in line chart
  let ratings = []
  let n = []
  let i = 0

  let myData = cloneJSON(rowData).reverse()

  myData.map((row) => {
    i += 1
    n.push(String(i))
    let thisRating = row.rating
    if (thisRating == null) {
      thisRating = 0
    }
    ratings.push(thisRating)
  })
  console.log(n)
  console.log(ratings)
  const average_rating = Math.round(average(ratings))

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Heaven/Hell Chart | Average: ${average_rating}`,
      },
    },
  }

  const chart_data = {
    labels: n,
    datasets: [
      {
        data: ratings,
        borderColor: "rgb(12, 99, 255)",
      },
    ],
  }

  return (
    <>
      <div
        className="p-3"
        style={{ position: "relative", height: "auto", width: "90vw" }}
      >
        <Line options={options} data={chart_data} />
      </div>
      <Toast ref={toastRef} />
    </>
  )
}

export { HeavenGraph }
