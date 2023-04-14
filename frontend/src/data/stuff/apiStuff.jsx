import { axiosAuth } from "../axios"

/* ITEM GROUPS */

const getGroups = async () => {
  const url = `/groups`
  const response = await axiosAuth.get(url)
  return response.data
}

const getGroup = async (group_id) => {
  const url = `/group/${group_id}`
  const response = await axiosAuth.get(url)
  //console.log(response.data)
  return response.data
}

const deleteGroup = async (group_id) => {
  const url = `/delete_group/${group_id}`
  const response = await axiosAuth.get(url)
  console.log(response.data)
  return response.data
}

const addGroup = async (props) => {
  const { group_name, notes } = props
  const url = "/add_stuff_group"
  const data = JSON.stringify({ group_name, notes })
  const response = await axiosAuth.post(url, data)
  console.log(response)
  return response
}

const editGroup = async (props) => {
  console.log("editGroup")
  console.log(props)
  const { id, group_name, notes } = props
  const url = "/edit_stuff_group"
  const data = JSON.stringify({ id, group_name, notes })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editGroupName = async (props) => {
  console.log("editGroupName")
  console.log(props)
  const { id, group_name } = props
  const url = "/edit_stuff_group_name"
  const data = JSON.stringify({ id, group_name })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editGroupNote = async (props) => {
  console.log("editGroupNote")
  const { id, note } = props
  const url = "/edit_stuff_group_note"
  const data = JSON.stringify({ id, note })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

/* ITEMS */
const getItems = async (group_id) => {
  //console.log(group_id)
  const url = `/stuff/${group_id}`
  //console.log(url)
  const response = await axiosAuth.get(url)
  return response.data
}

const getItem = async (item_id) => {
  //console.log(item_id)
  const url = `/item/${item_id}`
  console.log(url)
  const response = await axiosAuth.get(url)
  return response.data
}

const deleteItem = async (item_id) => {
  const url = `/delete_item/${item_id}`
  const response = await axiosAuth.get(url)
  console.log(response.data)
  return response.data
}

const addItem = async (props) => {
  const url = "/add_item"
  console.log(url)
  console.log(props)
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editItem = async (props) => {
  const url = "/edit_item"
  console.log(url)
  console.log(props)
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editItemName = async (props) => {
  console.log("editItemName")
  const { item_id, item_name } = props
  const url = "/edit_item_name"
  const data = JSON.stringify({ item_id, item_name })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editItemNote = async (props) => {
  console.log("editItemNote")
  const { item_id, note } = props
  const url = "/edit_item_note"
  const data = JSON.stringify({ item_id, note })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editItemPurchasedLocation = async (props) => {
  console.log("editItemPurchasedLocation")
  const { item_id, purchased_location } = props
  const url = "/edit_item_purchased_location"
  const data = JSON.stringify({ item_id, purchased_location })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editItemPurchasedDate = async (props) => {
  console.log("editItemPurchasedDate")
  const { item_id, purchase_date } = props
  const url = "/edit_item_purchased_date"
  const data = JSON.stringify({ item_id, purchase_date })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

const editItemCost = async (props) => {
  console.log("editItemCost")
  const { item_id, amount_paid } = props
  const url = "/edit_item_cost"
  const data = JSON.stringify({ item_id, amount_paid })
  const response = await axiosAuth.post(url, props)
  console.log(response)
  return response
}

export {
  getGroups,
  getGroup,
  deleteGroup,
  addGroup,
  editGroup,
  editGroupName,
  editGroupNote,
  getItems,
  getItem,
  deleteItem,
  addItem,
  editItem,
  editItemName,
  editItemNote,
  editItemPurchasedLocation,
  editItemPurchasedDate,
  editItemCost,
}
