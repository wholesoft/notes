import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNotes, useTags } from "../data/notes/useNotes"

import { FilterMatchMode, PrimeIcons } from "primereact/api"
import { Toast } from "primereact/toast"
import { Button } from "primereact/button"

import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js"

import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Title, Tooltip, Legend)

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

const EightChart = (props) => {
  const dataQuery = useNotes()
  const tagQuery = useTags()

  const rowData = dataQuery.data
  const tagData = tagQuery.data

  if (dataQuery.isLoading || tagQuery.isLoading) return <h1>Loading...</h1>
  if (dataQuery.isError || tagQuery.isError) {
    return <pre>{JSON.stringify(dataQuery.error)}</pre>
  }
  //console.log(rowData)

  let tagNames = []
  /*   tagData.map((tag) => {
    tagNames.push(tag.tag)
  }) */

  let tag_counts = {}

  let all_dates = []

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

  // We can filter this data to just the time range we are interested in

  //console.log(myData)
  let totalTags = 0
  myData.map((row) => {
    all_dates.push(row.created_usertime)
    row.tags.map((tag) => {
      totalTags += 1
      if (!tagNames.includes(tag)) {
        tagNames.push(tag)
      }
      if (tag_counts[tag] == null) {
        tag_counts[tag] = 1
      } else {
        tag_counts[tag] += 1
      }
    })

    //console.log(typeof row.created_usertime)
  })

  let pieData = []
  let tooltips = []
  tagNames.map((tag) => {
    if (tag_counts[tag] == null) {
      tag_counts[tag] = 0
    }
    let percent = Math.round((tag_counts[tag] / totalTags) * 100)
    pieData.push(percent)
    tooltips.push(`${percent}%`)
  })

  const data = {
    labels: tagNames,
    datasets: [
      {
        data: pieData,
        backgroundColor: [
          "#ffadad",
          "#ffd6a5",
          "#fdffb6",
          "#caffbf",
          "#9bf6ff",
          "#a0c4ff",
          "#ffc6ff",
          "#eeeeec",
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ""

            if (label) {
              label += ": "
            }
            label += context.formattedValue + "%"
            return label
          },
        },
      },
    },
  }

  return (
    <>
      <div
        className="p-3"
        style={{
          position: "relative",
          height: "40%",
          width: "40%",
          margin: "auto",
        }}
      >
        <Pie data={data} options={options}></Pie>
      </div>
    </>
  )
}

export { EightChart }
