import React, { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { AddItemImage } from "./AddItemImage.jsx"

import {
  useItems,
  useDeleteItem,
  useEditItemName,
  useEditItemNote,
  useEditItemPurchasedLocation,
  useEditItemPurchasedDate,
  useEditItemCost,
} from "../data/notes/useNotes"

import { InputText } from "primereact/inputtext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { parseISO, format } from "date-fns"
import { Toast } from "primereact/toast"
import { Card } from "primereact/card"

function formatDate(date_string) {
  let result = ""
  if (date_string != null) {
    result = new Date(date_string).toLocaleDateString()
  }
  return result
}

const DisplayItems = (props) => {
  const group_id = props.groupId
  const toastRef = useRef()
  const itemsQuery = useItems(group_id)
  const deleteMutation = useDeleteItem(toastRef, group_id)
  const editItemNameMutation = useEditItemName()
  const editItemNoteMutation = useEditItemNote()
  const editItemPurchasedLocationMutation = useEditItemPurchasedLocation()
  const editItemPurchasedDateMutation = useEditItemPurchasedDate()
  const editItemCostMutation = useEditItemCost()
  const data = itemsQuery.data

  let BASE_URL = "https://notes-api.wholesoft.net"
  if (process.env.NODE_ENV == "development") {
    BASE_URL = "http://localhost:3001"
  }

  function isIsoDate(str) {
    // Really just looking for this format: "2023-03-30T07:00:00.000Z"
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false
    const d = new Date(str)
    return d instanceof Date && !isNaN(d) && d.toISOString() === str // valid date
  }

  let totalSpent = (data) => {
    let total = 0
    let a = data.map((row) => {
      if (row.amount_paid != "" && row.amount_paid != null) {
        total += parseFloat(row.amount_paid)
      }
    })
    return total
  }

  let displayDatePurchased = (rowData) => {
    let value = rowData.date_purchased
    return formatDate(value)
  }

  let displayImage = (row) => {
    let value = row.image
    let item_id = row.id
    let result = (
      <>
        <AddItemImage item_id={item_id} />
      </>
    )
    if (value != "" && value != null) {
      result = (
        <>
          <img
            style={{ maxWidth: "300px", margin: "0 auto" }}
            src={`${BASE_URL}/images/${value}`}
            alt=""
          />
        </>
      )
    }

    return result
  }

  if (itemsQuery.isLoading) return <h1>Loading...</h1>
  if (itemsQuery.isError) {
    return <pre>{JSON.stringify(itemsQuery.error)}</pre>
  }
  return (
    <>
      <div className="grid">
        {data.map((row) => {
          //console.log(row)
          return (
            <div key={row.id} className="col-12 md:col-6 lg:col-3 xl: col-2">
              <Card
                title={row.item_name}
                subTitle={row.notes}
                header={displayImage(row)}
                style={{ position: "relative" }}
              >
                <p>Purchase Location: {row.purchased_location}</p>
                <p>Date: {formatDate(row.date_purchased)}</p>
                <p>Cost: {row.amount_paid}</p>

                <div
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  <Link to={`/edit_item/${row.group_id}/${row.id}`}>
                    <span className="pi pi-pencil"></span>
                  </Link>
                  <span
                    className="pi pi-trash ml-2"
                    onClick={(e) => {
                      deleteMutation.mutate(row.id)
                    }}
                  ></span>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
      <Toast ref={toastRef} />
    </>
  )
}

export { DisplayItems }
