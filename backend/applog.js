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

export async function logEvent(props) {
  //addNote({ user_id, note })
  // Returns { 'success': true/false , 'message': '' }
  // 'note_id' is also returned on success
  let success = false
  let message = ""
  let validation_okay = true

  // VALIDATE INPUT
  const schema = joi.object({
    user_id: joi.number().integer().allow(null),
    note_id: joi.number().integer().allow(null),
    event: joi.string().required(),
    details: joi.string().allow(null),
    misc: joi.string().allow(null),
  })

  const { error, value } = schema.validate(props)
  if (error) {
    console.log(error)
    console.log("Validation Error.")
    message = "Vaidation Error (" + error.details[0].message + ")"
    validation_okay = false
    return { success: false, message: message }
  }

  // Add the Event
  let log_id = 0
  if (validation_okay) {
    const result = await pool.query(
      `
           INSERT INTO AppLog (user_id, event, details, misc, created, note_id) 
           VALUES (?,?,?,?,CURRENT_TIMESTAMP,?)
           `,
      [props.user_id, props.event, props.details, props.misc, props.note_id]
    )
    success = true
    message = `Event Added.`
    log_id = result[0].insertId
  }

  return { success, message, log_id }
}

export async function getUserActivity(props) {
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
        SELECT id, note_id, event, details, misc, created
        FROM AppLog
        WHERE user_id=?
        ORDER BY id DESC
        `,
    [props.user_id]
  )

  return { success: true, message: "OK", data: rows }
}

/*
describe AppLog;
+---------+--------------+------+-----+-------------------+-------------------+
| Field   | Type         | Null | Key | Default           | Extra             |
+---------+--------------+------+-----+-------------------+-------------------+
| id      | int          | NO   | PRI | NULL              | auto_increment    |
| user_id | int          | YES  |     | NULL              |                   |
| event   | varchar(255) | YES  |     | NULL              |                   |
| details | varchar(255) | YES  |     | NULL              |                   |
| misc    | text         | YES  |     | NULL              |                   |
| created | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| note_id | int          | YES  |     | NULL              |                   |
+---------+--------------+------+-----+-------------------+-------------------+

*/
