import { useState, useEffect, useRef } from "react"
import { useUpdatetNoteTimer } from "../data/notes/useNotes"

function secondsToDhms(seconds) {
  seconds = Number(seconds)
  var d = Math.floor(seconds / (3600 * 24))
  var h = Math.floor((seconds % (3600 * 24)) / 3600)
  var m = Math.floor((seconds % 3600) / 60)
  var s = Math.floor(seconds % 60)

  var dDisplay = d > 0 ? d + (d == 1 ? "d " : "d ") : ""
  var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : ""
  var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : ""
  var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : ""
  return dDisplay + hDisplay + mDisplay + sDisplay
}

function NoteTimer(props) {
  const { note } = props
  const noteId = note.id
  const [timerStatus, setTimerStatus] = useState(note.timer_status)
  const [startTime, setStartTime] = useState(new Date(note.timer_start))
  const [elapsedTime, setElapsedTime] = useState(note.timer_elapsed)
  const [origElapsedTime, setOrigElapsedTime] = useState(note.timer_elapsed)
  const updateTimerMutation = useUpdatetNoteTimer()

  let interval = null
  useEffect(() => {
    clearInterval(interval)
    if (timerStatus === "running") {
      //console.log("go")
      interval = setInterval(incrementTime, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [timerStatus])

  const incrementTime = (rightNow) => {
    const currentTime = new Date()
    //console.log(startTime)
    //console.log(currentTime)
    const seconds = (currentTime.getTime() - startTime.getTime()) / 1000
    setElapsedTime(Math.floor(seconds) + origElapsedTime)
  }

  const startTimer = () => {
    if (timerStatus === "never started" || timerStatus === null) {
      const timer_start = new Date()
      setStartTime(timer_start)
      setTimerStatus("running")
      updateTimerMutation.mutate({
        note_id: noteId,
        timer_start,
        timer_status: "running",
        timer_elapsed: 0,
      })
    } else if (timerStatus === "paused") {
      const timer_start = new Date()
      setStartTime(timer_start)
      setTimerStatus("running")
      updateTimerMutation.mutate({
        note_id: noteId,
        timer_start,
        timer_status: "running",
        timer_elapsed: elapsedTime,
      })
    }
  }

  const pauseTimer = () => {
    if (timerStatus !== "paused") {
      // save elapsed time
      console.log("paused")
      setTimerStatus("paused")
      setOrigElapsedTime(elapsedTime)
      updateTimerMutation.mutate({
        note_id: noteId,
        timer_start: null,
        timer_status: "paused",
        timer_elapsed: elapsedTime,
      })
    }
  }

  const displayElapsedTime = () => {
    const result = secondsToDhms(elapsedTime)
    return result
  }

  //setInterval(() => setElapsedTime(elapsedTime + 1), 1000)
  //setInterval(() => console.log("hello"), 1000)

  return (
    <>
      {elapsedTime > 0 ? (
        <span className="mr-2">{displayElapsedTime()}</span>
      ) : (
        <></>
      )}
      {timerStatus === null ? (
        <span>
          <i
            className="pi pi-clock mr-4 cursor-pointer"
            style={{ fontSize: "1rem" }}
            onClick={startTimer}
          ></i>
        </span>
      ) : timerStatus === "running" ? (
        <span>
          <i
            className="pi pi-pause mr-4 cursor-pointer"
            style={{ fontSize: ".7rem" }}
            onClick={pauseTimer}
          ></i>
        </span>
      ) : (
        <span>
          <i
            className="pi pi-play mr-4 cursor-pointer"
            style={{ fontSize: ".7rem" }}
            onClick={startTimer}
          ></i>
        </span>
      )}
    </>
  )
}

export { NoteTimer }
