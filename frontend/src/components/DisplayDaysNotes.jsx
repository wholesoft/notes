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

const DisplayDaysNotes = (props) => {
  const toastRef = useRef()
  const notesQuery = useNotes()
  const noteDatesQuery = useNoteDates()
  const deleteMutation = useDeleteNote(toastRef)

  //let initDate = props.date

  let initDate = new Date()

  const offset = initDate.getTimezoneOffset()
  let initLocalDate = new Date(initDate.getTime() - offset * 60 * 1000)
  //console.log(initLocalDate)
  if (props.date != undefined) {
    // Having some issues with the calendar control displaying the day prior to
    // the props date instead of the props date.
    // I think it is a timezone issue.  This seems to fix it for me anyway.
    initLocalDate = new Date(
      new Date(props.date).getTime() + offset * 60 * 1000
    )
  }

  const [journalDate, setJournalDate] = useState(initLocalDate)
  //const [date, setDate] = useState(initDate)

  const handlePrev = () => {
    //console.log("howdy")
    let prevDay = new Date(journalDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setJournalDate(prevDay)
  }

  const handleNext = () => {
    //console.log("howdy")
    let nextDay = new Date(journalDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setJournalDate(nextDay)
  }

  const handleDateChange = (e) => {
    //console.log("handleDateChange")
    console.log(e.value.toISOString().slice(0, 10))
    setJournalDate(e.value)
    //let note_date = e.value.slice(0, 10) // yyyy-mm-dd
    //console.log(note_date)
    //navigate(`/mynotes/${note_date}`) // TODO: display toast message after navigating
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

  // working with dates is such a joy
  let day_to_filter = journalDate.toISOString().split("T")[0]

  let next_day = new Date(journalDate) // CHECK THIS
  next_day.setDate(next_day.getDate() + 1)
  next_day = next_day.toISOString().slice(0, 10) // yyyy-mm-dd

  const days_data = data.filter(function (el) {
    return (
      el.created_usertime >= day_to_filter && el.created_usertime <= next_day
    )
  })
  days_data.reverse()

  //console.log("Filter On")
  //console.log(day_to_filter)

  //console.log(date.toISOString())

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
              value={journalDate}
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
                  <div className="mt-2 mb-6" style={{ whiteSpace: "pre-wrap" }}>
                    {row.note}
                  </div>
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
