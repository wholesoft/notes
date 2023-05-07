import mysql from "mysql2"
import dotenv from "dotenv"
import joi from "joi"
import { logEvent } from "./applog.js"

dotenv.config()

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise()

export async function addNote(props) {
  //addNote({ user_id, note })
  // Returns { 'success': true/false , 'message': '' }
  // 'note_id' is also returned on success
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    note: joi.string().required(),
    local_time: joi.string().required(),
    timezone: joi.string().allow(""),
    rating: joi.number().integer().allow(null),
    eatingHabits: joi.number().integer().allow(null),
    slepttime: joi.string().allow("").allow(null),
    woketime: joi.string().allow("").allow(null),
    spent: joi.number().allow(null),
    tags: joi.array().items(joi.number()),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Add the Note
  // TODO: turn this into a transaction
  let note_id = 0
  if (validation_okay) {
    console.log(props)
    const result = await pool.query(
      `
         INSERT INTO Notes (user_id, note, created, updated, created_usertime, user_timezone, rating, slepttime, woketime, eating_habits, spent) 
         VALUES (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,?,?,?,?,?,?,?)
         `,
      [
        props.user_id,
        props.note,
        props.local_time,
        props.timezone,
        props.rating,
        props.slepttime,
        props.woketime,
        props.eatingHabits,
        props.spent,
      ]
    )
    success = true
    message = `Note Added.`
    note_id = result[0].insertId

    props.tags.map((tag_id) => {
      pool.query(
        `
           INSERT INTO NoteTags (tag_id, note_id)
           VALUES (?,?)
           `,
        [tag_id, note_id]
      )
    })

    logEvent({
      user_id: props.user_id,
      event: "Note Added",
      note_id: note_id,
      details: props.note.length + " characters long",
    })
  }

  return { success: success, message: message, note_id: note_id }
}

export async function updateNote(props) {
  // updateNote({ user_id, note_id, note })
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    note_id: joi.number().integer().required(),
    note: joi.string().required(),
    rating: joi.number().integer().allow(null),
    eatingHabits: joi.number().integer().allow(null),
    slepttime: joi.string().allow("").allow(null),
    woketime: joi.string().allow("").allow(null),
    spent: joi.number().allow(null),
    tags: joi.array().items(joi.number()),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  console.log("TAGS:")
  console.log(props.tags)

  // Update the Note
  if (validation_okay) {
    const result = await pool.query(
      `
         UPDATE Notes SET note=?, updated=CURRENT_TIMESTAMP, rating=?, eating_habits=?, slepttime=?, woketime=?, spent=?
         WHERE id=? AND user_id=?
         `,
      [
        props.note,
        props.rating,
        props.eatingHabits,
        props.slepttime,
        props.woketime,
        props.spent,
        props.note_id,
        props.user_id,
      ]
    )
    if (result[0].changedRows > 0) {
      console.log(typeof result[0])
      console.log(result[0]["ResultSetHeader"])

      await pool.query(
        `
         DELETE FROM NoteTags WHERE note_id=?
         `,
        [props.note_id]
      )

      props.tags.map(async (tag_id) => {
        await pool.query(
          `
           INSERT INTO NoteTags (tag_id, note_id)
           VALUES (?,?)
           `,
          [tag_id, props.note_id]
        )
      })

      success = true
      message = `Note Updated.`
    }
    logEvent({
      user_id: props.user_id,
      event: "Note Updated",
      note_id: props.note_id,
      details: props.note.length + " characters long",
    })
  }

  // return the note
  const res = await getNote({ note_id: props.note_id, user_id: props.user_id })

  return {
    success: success,
    message: message,
    note_id: props.note_id,
    note: res.data,
  }
}

export async function deleteNote(props) {
  // deleteNote({ user_id, note_id })
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    note_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Delete the note
  if (validation_okay) {
    const result = await pool.query(
      `
         DELETE FROM Notes WHERE id=? AND user_id=?
         `,
      [props.note_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Note Deleted (${props.note_id}).`

    logEvent({
      user_id: props.user_id,
      event: "Note Deleted",
      note_id: props.note_id,
      details: "i hope that one wasn't important",
    })
  }

  return { success: success, message: message }
}

export async function getNotes(props) {
  // getNotes({ user_id })
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
      SELECT a.id, a.note, a.title, a.description, a.created, a.updated, a.rating,
      DATE_FORMAT(a.created_usertime, "%Y-%m-%d %I:%i %p") as created_usertime, a.user_timezone,
      a.eating_habits, a.slepttime, a.woketime, a.spent,
      JSON_ARRAYAGG(c.tag) as tags
      FROM Notes a
      LEFT JOIN NoteTags b ON a.id=b.note_id
      LEFT JOIN Tags c ON b.tag_id=c.id
      WHERE user_id=?
      GROUP BY a.id, a.note, a.title, a.description, a.created, a.updated, a.rating, 
      a.eating_habits, a.slepttime, a.woketime, a.spent, created_usertime, a.user_timezone
      ORDER BY a.id DESC
      `,
    [props.user_id]
  )

  //console.log(rows)
  return { success: true, message: "OK", data: rows }
}

export async function getNoteDates(props) {
  // getNotes({ user_id })
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
      SELECT DISTINCT DATE_FORMAT(created_usertime, "%c/%e/%Y") as note_date
      FROM Notes
      WHERE user_id=?
      ORDER BY note_date DESC
      `,
    [props.user_id]
  )
  // %c/%e/%Y returns the month and day without leading zeros
  // Using that to make it easier to work with the PrimeReact Calendar control

  const datesArray = new Array()
  rows.map((row) => datesArray.push(row.note_date))

  return { success: true, message: "OK", data: datesArray }
}

export async function getNote(props) {
  // getNote({ user_id, note_id })
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
    note_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    //console.log(message)
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
      SELECT id, note, title, description, created, updated, rating,
      DATE_FORMAT(created_usertime, "%Y-%m-%d %I:%i %p") as created_usertime, user_timezone,
      a.eating_habits, a.slepttime, a.woketime, a.spent
      FROM Notes a WHERE user_id=? AND id=?
      `,
    [props.user_id, props.note_id]
  )
  if (rows.length == 0) {
    return { success: false, message: "Error, Note Not Found.", data: [] }
  }

  const tags = await getNoteTags({ note_id: props.note_id })
  let note = { ...rows[0], tags: tags.data }

  //console.log(note)

  return { success: true, message: "OK", data: note }
}

export async function getAllTags(props) {
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  const [rows] = await pool.query(
    `
      SELECT id, tag FROM Tags Order By Tag
      `
  )

  return { success: true, message: "OK", data: rows }
}

export async function getNoteTags(props) {
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    note_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    //console.log(message)
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
      SELECT a.tag_id, b.tag 
      FROM NoteTags a
      LEFT JOIN Tags b ON a.tag_id=b.id
      WHERE a.note_id=?
      `,
    [props.note_id]
  )
  if (rows.length == 0) {
    return { success: false, message: "Error, Note Not Found.", data: [] }
  }

  let tags = []
  rows.map((row) => {
    tags.push(row.tag_id)
  })

  console.log(tags)

  return { success: true, message: "OK", data: tags }
}

export async function getUserNoteTags(props) {
  // Returns { 'success': true/false , 'message': '', 'data': [] }
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().required(),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    //console.log(message)
    validation_okay = false
    return { success: false, message: message, data: [] }
  }
  const [rows] = await pool.query(
    `
      SELECT b.note_id, JSON_ARRAYAGG(c.tag) as tags
      FROM Notes a 
      LEFT JOIN NoteTags b ON a.id = b.note_id
      LEFT JOIN Tags c ON b.tag_id=c.id
      WHERE a.user_id=? AND b.note_id IS NOT NULL 
      GROUP BY b.note_id
      `,
    [props.user_id]
  )
  if (rows.length == 0) {
    return { success: false, message: "Error, Note Not Found.", data: [] }
  }

  return { success: true, message: "OK", data: rows }
}

/*
Notes
+------------------+--------------+------+-----+-------------------+-------------------+
| Field            | Type         | Null | Key | Default           | Extra             |
+------------------+--------------+------+-----+-------------------+-------------------+
| id               | int          | NO   | PRI | NULL              | auto_increment    |
| user_id          | int          | YES  |     | NULL              |                   |
| title            | varchar(255) | YES  |     | NULL              |                   |
| description      | varchar(255) | YES  |     | NULL              |                   |
| note             | text         | YES  |     | NULL              |                   |
| created          | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated          | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| created_usertime | datetime     | YES  |     | NULL              |                   |
| user_timezone    | varchar(255) | YES  |     | NULL              |                   |
+------------------+--------------+------+-----+-------------------+-------------------+
*/

function test() {
  console.log("TEST FUNCTION")
  getNotes({ user_id: 45 })
}

test()
