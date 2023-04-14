import { AddEditItemForm } from "../components/AddEditItemForm"
import { tabTitle } from "../utils/helperFunctions"
import { useParams } from "react-router-dom"
import { useItem } from "../data/stuff/useStuff"

const EditItem = () => {
  const params = useParams()
  let group_id = params.groupId
  let item_id = params.itemId
  if (item_id == undefined) {
    item_id = 0
  }
  const dataQuery = useItem(item_id)

  //console.log(group_id)

  let pageTitle = "Add Item - Wholesoft Stuff"
  if (item_id > 0) {
    pageTitle = "Edit Item - Wholesoft Stuff"
  }

  if (dataQuery.isLoading || dataQuery.isFetching) return <h1>Loading...</h1>
  if (dataQuery.isError) {
    return <pre>{JSON.stringify(dataQuery.error)}</pre>
  }

  if (dataQuery.data[0] != undefined) {
    //console.log(dataQuery.data)
    group_id = dataQuery.data[0].group_id
  }
  //console.log(group_id)
  //console.log(item_id)
  return (
    <>
      {tabTitle(pageTitle)}
      <AddEditItemForm
        data={dataQuery.data[0]}
        groupId={group_id}
        itemId={item_id}
      />
    </>
  )
}

export { EditItem }
