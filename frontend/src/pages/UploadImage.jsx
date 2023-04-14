import { useState } from "react"
import { useAxiosPrivate } from "../hooks/useAxiosPrivate"
import { tabTitle } from "../utils/helperFunctions"

const UploadImage = () => {
  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [imageName, setImageName] = useState()
  const axiosPrivate = useAxiosPrivate()

  const submit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append("image", file)
    formData.append("description", description)
    console.log("POSTING IMAGE")
    const result = await axiosPrivate.post("/api/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    setImageName(result.data.imageName)
  }

  return (
    <>
      {tabTitle("Upload Image - Wholesoft Stuff")}
      <p>{imageName}</p>
      <p>{description}</p>
      <form onSubmit={submit}>
        <input
          filename={file}
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="image/*"
        ></input>
        <input
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export { UploadImage }
