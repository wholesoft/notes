import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNotes, useDeleteNote } from "../data/notes/useNotes"

import { Toast } from "primereact/toast"
import { Card } from "primereact/card"

function formatTime(date_string) {
  // Should output in this format:
  // 6:59 AM
  let result = ""
  if (date_string != null) {
    //let dateString = new Date(date_string).toLocaleDateString()
    let timeString = new Date(date_string).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    //result = `${timeString} ${dateString}`
    result = `${timeString}`
  }
  return result
}

const DisplayDaysNotes = () => {
  const toastRef = useRef()

  const notesQuery = useNotes()
  const deleteMutation = useDeleteNote(toastRef)
  const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString())

  const handlePrev = () => {
    console.log("howdy")
    let prevDay = new Date(currentDay)
    prevDay.setDate(prevDay.getDate() - 1)
    prevDay = prevDay.toLocaleDateString()
    console.log(prevDay)
    setCurrentDay(prevDay)
  }

  const handleNext = () => {
    console.log("howdy")
    let nextDay = new Date(currentDay)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay = nextDay.toLocaleDateString()
    console.log(nextDay)
    setCurrentDay(nextDay)
  }

  if (notesQuery.isLoading) return <h1>Loading...</h1>
  if (notesQuery.isError) {
    return <pre>{JSON.stringify(notesQuery.error)}</pre>
  }
  const data = notesQuery.data

  // pass in a date_string if we want a different day
  // working with dates is such a joy

  const day_to_show = new Date(currentDay).toLocaleDateString() // mm/dd/yyyy
  const day_to_filter = new Date(currentDay).toISOString().slice(0, 10) // yyyy-mm-dd
  let next_day = new Date(currentDay)
  next_day.setDate(next_day.getDate() + 1)
  next_day = next_day.toISOString().slice(0, 10) // yyyy-mm-dd

  const days_data = data.filter(function (el) {
    return (
      el.created_usertime >= day_to_filter && el.created_usertime <= next_day
    )
  })
  days_data.reverse()
  console.log(days_data)
  console.log(data)
  return (
    <>
      <div className="grid">
        <div className="col-12 lg:col-8">
          <div style={{ textAlign: "center" }} className="pb-2">
            <span
              className="pi pi-arrow-left text-sm"
              onClick={handlePrev}
            ></span>
            &nbsp;&nbsp;
            <span className="text-2xl text-bold">
              <b>{day_to_show}</b>
            </span>
            &nbsp;&nbsp;
            <span
              className="pi pi-arrow-right text-sm"
              onClick={handleNext}
            ></span>
          </div>
          <Card
            title=""
            subTitle=""
            className=""
            style={{ position: "relative" }}
          >
            {days_data.map((row) => {
              return (
                <div key={row.id} style={{ position: "relative" }}>
                  <div>
                    <b>{formatTime(row.created)}</b>
                  </div>
                  <div className="text-xs">Rating: {row.rating}</div>
                  <div className="mt-2 mb-6">{row.note}</div>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
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
                </div>
              )
            })}
          </Card>
        </div>
      </div>
    </>
  )
}

export { DisplayDaysNotes }
