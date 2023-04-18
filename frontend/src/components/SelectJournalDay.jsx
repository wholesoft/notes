import { useState, useEffect } from "react"
import { Calendar } from "primereact/calendar"

const SelectJournalDay = (props) => {
  console.log(`value is: ${props.value}`)
  //console.log(JSON.stringify(value))
  const [date, setDate] = useState(new Date(props.value))

  const dateTemplate = (date) => {
    if (date.day > 10 && date.day < 15) {
      return (
        <strong style={{ textDecoration: "line-through" }}>{date.day}</strong>
      )
    }

    return date.day
  }

  return (
    <Calendar
      value={date}
      onChange={(e) => setDate(e.value)}
      showIcon
      dateTemplate={dateTemplate}
    />
  )
}

export { SelectJournalDay }
