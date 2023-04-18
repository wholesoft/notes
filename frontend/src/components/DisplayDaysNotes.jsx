import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNotes, useDeleteNote, useNoteDates } from "../data/notes/useNotes"
import { Calendar } from "primereact/calendar"
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
  const noteDatesQuery = useNoteDates()
  const deleteMutation = useDeleteNote(toastRef)
  const [date, setDate] = useState(new Date())

  const handlePrev = () => {
    //console.log("howdy")
    let prevDay = new Date(date)
    prevDay.setDate(prevDay.getDate() - 1)
    setDate(prevDay)
  }

  const handleNext = () => {
    //console.log("howdy")
    let nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    setDate(nextDay)
  }

  const handleDateChange = (e) => {
    //console.log("handleDateChange")
    setDate(e.value)
  }

  if (notesQuery.isLoading || noteDatesQuery.isLoading)
    return <h1>Loading...</h1>
  if (notesQuery.isError) {
    return <pre>{JSON.stringify(notesQuery.error)}</pre>
  }

  const dateTemplate = (date) => {
    // this date will have a month with 0 = Jan, 11 = Nov
    if (noteDatesQuery.isFetched) {
      let formatDate = `${date.month + 1}/${date.day}/${date.year}`
      if (noteDatesQuery.data.includes(formatDate)) {
        return <strong>{date.day}</strong>
      }
    }

    return date.day
  }

  const data = notesQuery.data

  // pass in a date_string if we want a different day
  // working with dates is such a joy

  //const day_to_filter = new Date(currentDay).toISOString().slice(0, 10) // yyyy-mm-dd
  const day_to_filter = date.toISOString().slice(0, 10) // yyyy-mm-dd
  let next_day = new Date(date) //CHECK THIS
  next_day.setDate(next_day.getDate() + 1)
  next_day = next_day.toISOString().slice(0, 10) // yyyy-mm-dd

  const days_data = data.filter(function (el) {
    return (
      el.created_usertime >= day_to_filter && el.created_usertime <= next_day
    )
  })
  days_data.reverse()

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
            <Calendar
              value={date}
              onChange={handleDateChange}
              showIcon
              dateTemplate={dateTemplate}
            />
            &nbsp;&nbsp;
            <span
              className="pi pi-arrow-right text-sm"
              onClick={handleNext}
            ></span>
          </div>
          <div></div>
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
