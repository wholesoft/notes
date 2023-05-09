import { tabTitle } from "../utils/helperFunctions"
import { Link } from "react-router-dom"
import { DisplayDaysNotes } from "../components/DisplayDaysNotes"
import { HeavenGraph } from "../components/HeavenGraph"
import { SpentGraph } from "../components/SpentGraph"
import { NutritionGraph } from "../components/NutritionGraph"
import { SleepGraph } from "../components/SleepGraph"
import { EightChart } from "../components/EightChart"
import { useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { useState } from "react"

const TodaysNotes = () => {
  const [dateFilter, setDateFilter] = useState("Today")
  let { date } = useParams()
  //console.log(date)
  return (
    <>
      {tabTitle("My Notes - Wholesoft Notes")}

      <DisplayDaysNotes date={date} />

      <div className="flex justify-content-center mt-3">
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
      </div>

      <HeavenGraph dateFilter={dateFilter} />

      <SpentGraph dateFilter={dateFilter} />

      <NutritionGraph dateFilter={dateFilter} />

      <SleepGraph dateFilter={dateFilter} />

      <EightChart dateFilter={dateFilter} />
    </>
  )
}

export { TodaysNotes }
