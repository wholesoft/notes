import { AddEditGroupForm } from "../components/AddEditGroupForm"
import { tabTitle } from "../utils/helperFunctions"
import { useParams } from "react-router-dom"
import { useGroup } from "../data/stuff/useStuff"

const EditGroup = () => {
  const params = useParams()
  let group_id = params.groupId // props.groupId
  if (group_id == undefined) {
    group_id = 0
  }
  const groupQuery = useGroup(group_id)

  let pageTitle = "Add Group - Wholesoft Stuff"
  if (group_id > 0) {
    pageTitle = "Edit Group - Wholesoft Stuff"
  }

  if (groupQuery.isLoading || groupQuery.isFetching) return <h1>Loading...</h1>
  if (groupQuery.isError) {
    return <pre>{JSON.stringify(groupQuery.error)}</pre>
  }

  return (
    <>
      {tabTitle(pageTitle)}
      <AddEditGroupForm data={groupQuery.data[0]} />
    </>
  )
}

export { EditGroup }
