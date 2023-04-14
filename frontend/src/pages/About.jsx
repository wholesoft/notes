import { tabTitle } from "../utils/helperFunctions"

const About = () => {
  return (
    <>
      {tabTitle("Wholesoft Stuff")}
      <p>A simple and free app to keep track of your stuff.</p>
      <p>Your stuff can be organized into custom groups.</p>
      <p>
        Each item can have a photo along with data fields for the date
        purchased, location purchased, cost, and miscellaneous notes.
      </p>
      <p>
        This app is intended to give a simple way to track items for a project,
        hobby, insurance reasons, moving boxes, etc.
      </p>
    </>
  )
}

export { About }
