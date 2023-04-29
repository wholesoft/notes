import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNotes } from "../data/notes/useNotes"

import { FilterMatchMode, PrimeIcons } from "primereact/api"
import { Toast } from "primereact/toast"
import { Button } from "primereact/button"

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

const HeavenGraph = () => {
  const [dateFilter, setDateFilter] = useState("Today")

  const dataQuery = useNotes()

  const rowData = dataQuery.data

  if (dataQuery.isLoading) return <h1>Loading...</h1>
  if (dataQuery.isError) {
    return <pre>{JSON.stringify(dataQuery.error)}</pre>
  }
  //console.log(rowData)

  // Format query data for use in line chart
  let ratings = []
  let n = []
  let rating_dates = []
  let i = 0

  let today = local_today() // new Date().toJSON().slice(0, 10)
  let this_month = new Date().toJSON().slice(0, 7)

  let myData = cloneJSON(rowData).reverse()

  if (dateFilter == "Today") {
    myData = myData.filter((data) => {
      return data.created_usertime >= today
    })
  } else if (dateFilter == "This Month") {
    myData = myData.filter((data) => {
      return data.created_usertime >= this_month
    })
  }

  // We can filter this data to just the time range we are interested in

  //console.log(myData)

  myData.map((row) => {
    i += 1
    n.push(String(i))
    //console.log(typeof row.created_usertime)
    rating_dates.push(row.created_usertime)
    let thisRating = row.rating
    if (thisRating == null) {
      thisRating = 0
    }
    ratings.push(thisRating)
  })
  // console.log(n)
  //console.log(ratings)
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
    labels: rating_dates,
    datasets: [
      {
        data: ratings,
        borderColor: "rgb(12, 99, 255)",
      },
    ],
  }

  return (
    <>
      {" "}
      <div className="flex justify-content-center">
        <Button
          label="Today"
          onClick={() => {
            setDateFilter("Today")
          }}
        />
        &nbsp;&nbsp;
        <Button
          label="This Month"
          onClick={() => {
            setDateFilter("This Month")
          }}
        />
        {/*         &nbsp;&nbsp;{dateFilter}&nbsp;&nbsp;{today}&nbsp;&nbsp;{this_month} */}
      </div>
      <div
        className="p-3"
        style={{ position: "relative", height: "auto", width: "90vw" }}
      >
        <Line options={options} data={chart_data} />
      </div>
    </>
  )
}

export { HeavenGraph }
