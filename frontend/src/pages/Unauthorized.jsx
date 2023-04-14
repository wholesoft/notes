import { useNavigate } from "react-router-dom"
import { tabTitle } from "../utils/helperFunctions"

const Unauthorized = () => {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  return (
    <>
      {tabTitle("Unauthorized - Wholesoft Stuff")}
      <h1>Unauthorized</h1>
      <br />
      <p>You do not have access to the requested page.</p>
      <div>
        <button onClick={goBack}>Go Back</button>
      </div>
    </>
  )
}

export { Unauthorized }
