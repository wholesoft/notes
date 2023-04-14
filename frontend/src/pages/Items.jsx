import { DisplayItems } from "../components/DisplayItems"
import { AddEditItemForm } from "../components/AddEditItemForm"
import { useParams, Link } from "react-router-dom"
import { useGroup } from "../data/stuff/useStuff"
import { tabTitle } from "../utils/helperFunctions"

const Items = (props) => {
  const { group_id } = useParams()
  const groupQuery = useGroup(group_id)
  const rowData = groupQuery.data

  if (groupQuery.isLoading) return <h1>Loading...</h1>
  if (groupQuery.isError) {
    return <pre>{JSON.stringify(groupQuery.error)}</pre>
  }
  return (
    <>
      {tabTitle("Items - Wholesoft Stuff")}
      <h2>{rowData[0].group_name}</h2>
      <p>{rowData[0].notes}</p>
      <p className="text-sm">
        <Link to={`/add_item/${group_id}`}>Add Item</Link>
      </p>
      <DisplayItems groupId={group_id} />

      {/* <AddEditItemForm data={{}} /> */}
    </>
  )
}

export { Items }
