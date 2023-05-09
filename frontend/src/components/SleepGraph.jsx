import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNotes } from "../data/notes/useNotes"

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

function local_today() {
  // YYYY-MM-DD
  var d = new Date()
  var datestring =
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2)
  //consol.log(datestring)
  return datestring
}

function hoursSlept(row) {
  var result = 0
  let hours = 0
  let minutes = 0
  if (row.snoozed?.length > 4 && row.snoozed != "00:00:00") {
    let time1 = row.slepttime.slice(0, 5).split(":")
    let time2 = row.woketime.slice(0, 5).split(":")
    time1 = Number(time1[0]) + Number(time1[1]) / 60
    time2 = Number(time2[0]) + Number(time2[1]) / 60
    if (time2 > time1) {
      result = time2 - time1
    } else {
      result = time2 + (24 - time1)
    }
    //let hours = Math.floor(result)
    //let minutes = Math.round((result - hours) * 60.0)
    //result = `${hours}h ${minutes}m`
  }
  return result
}

const SleepGraph = (props) => {
  const dataQuery = useNotes()

  const rowData = dataQuery.data

  if (dataQuery.isLoading) return <h1>Loading...</h1>
  if (dataQuery.isError) {
    return <pre>{JSON.stringify(dataQuery.error)}</pre>
  }
  //console.log(rowData)

  // Format query data for use in line chart
  let sleptData = []
  let chartDates = []

  let today = local_today() // new Date().toJSON().slice(0, 10)
  let this_month = new Date().toJSON().slice(0, 7)

  let myData = cloneJSON(rowData).reverse()

  if (props.dateFilter == "Today") {
    myData = myData.filter((data) => {
      return data.created_usertime >= today
    })
  } else if (props.dateFilter == "This Month") {
    myData = myData.filter((data) => {
      return data.created_usertime >= this_month
    })
  }

  myData.map((row) => {
    if (row.slepttime != "" && row.woketime != "") {
      let sleptLength = hoursSlept(row)
      if (sleptLength > 0) {
        chartDates.push(row.created_usertime)
        sleptData.push(sleptLength)
      }
    }
  })

  const averageSleep = Math.round(average(sleptData))

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Sleep Chart`,
      },
    },
    scales: {
      y: {
        min: 0,
      },
    },
  }

  if (sleptData.length == 1) {
    chartDates.push(chartDates[0])
    sleptData.push(sleptData[0])
  }

  const chartData = {
    labels: chartDates,
    datasets: [
      {
        data: sleptData,
        borderColor: "rgb(128, 0, 128)",
      },
    ],
  }

  return sleptData.length > 0 ? (
    <>
      <div
        className="p-3"
        style={{
          position: "relative",
          height: "250px",
          width: "90vw",
          margin: "auto",
        }}
      >
        <Line options={options} data={chartData} />
      </div>
    </>
  ) : (
    <></>
  )
}

export { SleepGraph }
