import mysql from "mysql2"
import dotenv from "dotenv"
import joi from "joi"

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
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Add the Group
  let note_id = 0
  if (validation_okay) {
    const result = await pool.query(
      `
         INSERT INTO Notes (user_id, note, created, updated) VALUES (?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
         `,
      [props.user_id, props.note]
    )
    success = true
    message = `Note Added.`
    note_id = result[0].insertId
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
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Update the Note
  if (validation_okay) {
    const result = await pool.query(
      `
         UPDATE Notes SET note=?, updated=CURRENT_TIMESTAMP
         WHERE id=? AND user_id=?
         `,
      [props.note, props.note_id, props.user_id]
    )
    console.log(result)
    success = true
    message = `Note Updated.`
  }

  return { success: success, message: message, note_id: props.note_id }
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
    message = `Note Deleted (${props.group_id}).`
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
      SELECT id, note, title, description, created, updated
      FROM Notes
      WHERE user_id=?
      ORDER BY id DESC
      `,
    [props.user_id]
  )

  return { success: true, message: "OK", data: rows }
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
      SELECT id, note, title, description, created, updated FROM Notes WHERE user_id=? AND id=?
      `,
    [props.user_id, props.note_id]
  )
  if (rows.length == 0) {
    return { success: false, message: "Error, Note Not Found.", data: [] }
  }
  return { success: true, message: "OK", data: rows }
}

/*
Notes
+-------------+--------------+------+-----+-------------------+-------------------+
| Field       | Type         | Null | Key | Default           | Extra             |
+-------------+--------------+------+-----+-------------------+-------------------+
| id          | int          | NO   | PRI | NULL              | auto_increment    |
| user_id     | int          | YES  |     | NULL              |                   |
| title       | varchar(255) | YES  |     | NULL              |                   |
| description | varchar(255) | YES  |     | NULL              |                   |
| note        | text         | YES  |     | NULL              |                   |
| created     | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated     | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-------------+--------------+------+-----+-------------------+-------------------+
*/
