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

const NutritionGraph = (props) => {
  const dataQuery = useNotes()

  const rowData = dataQuery.data

  if (dataQuery.isLoading) return <h1>Loading...</h1>
  if (dataQuery.isError) {
    return <pre>{JSON.stringify(dataQuery.error)}</pre>
  }
  //console.log(rowData)

  // Format query data for use in line chart
  let nutritionData = []
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
    if (row.eating_habits != null) {
      chartDates.push(row.created_usertime)
      nutritionData.push(row.eating_habits)
    }
  })

  const averageNutrition = Math.round(average(nutritionData))

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
        text: `Nutrition Chart | Average: ${averageNutrition}`,
      },
    },
    scales: {
      y: {
        min: -10,
        max: 10,
      },
    },
  }

  if (nutritionData.length == 1) {
    chartDates.push(chartDates[0])
    nutritionData.push(nutritionData[0])
  }

  const chartData = {
    labels: chartDates,
    datasets: [
      {
        data: nutritionData,
        borderColor: "rgb(184, 134, 11)",
      },
    ],
  }

  //console.log(chartDates)
  return nutritionData.length > 0 ? (
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

export { NutritionGraph }
