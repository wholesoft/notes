import express from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import UserAgent from "user-agents"

import {
  getNote,
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  getNoteDates,
  getAllTags,
} from "./notes.js"

import { getUserActivity } from "./applog.js"

import {
  create_user,
  confirm_email,
  login_user,
  getUsers,
  getUser,
  reset_password,
  get_user_id_from_password_token,
  send_email_confirmation_request,
  update_email_address,
  update_password,
  delete_user,
  update_user_roles,
} from "./user.js"
import { verifyJWT } from "./middleware/verifyJWT.js"
import cookieParser from "cookie-parser"
import refresh_route from "./routes/refresh.js"
import logout_route from "./routes/logout.js"
import credentials from "./middleware/credentials.js"
import corsOptions from "./config/corsOptions.js"

const is_admin = (roles) => {
  let result = false
  if (roles.includes(2001)) {
    result = true
  }
  return result
}

const upload = multer({ dest: "images/" })

const app = express()

app.use(credentials)

app.use(cors(corsOptions))

app.use(express.json())

// middleware for cookies
app.use(cookieParser())

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.send("Something broke!")
})

// trust proxy should mean req.ip returns the client ip address and not the proxy ip address
// nginx must be congigured for this to work
// proxy_set_header X-Forwarded-For $remote_addr;
app.set("trust proxy", true)

const clientUserAgent = new UserAgent()
let userAgentString = truncate(clientUserAgent.toString(), 250) // get user-agent.  truncate if too long.
let clientDetails = JSON.stringify(clientUserAgent.data, null, 2)

//app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send(process.env.APP_SHORT_DOMAIN)
})

app.get("/auth", async (req, res) => {
  //const { email, password } = req.body;
  //console.log(req.body)
  //const result = await login_user(req.body)
  let response = { success: false }
  res.send(response)
})

app.use("/refresh", refresh_route)

app.use("/logout", logout_route)

app.post("/auth", async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  const {
    refresh_token,
    access_token,
    success,
    roles,
    email_confirmed,
    user_id,
  } = await login_user(req.body, req.ip, userAgentString, clientDetails)
  console.log("Roles: " + roles)
  //let response = { success: success }
  if (success == true) {
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({
      success: success,
      access_token: access_token,
      roles: roles,
      email_confirmed: email_confirmed,
      user_id,
      user_id,
    })
  } else {
    console.log("Sending 401 Error")
    res.sendStatus(401)
  }
})

app.post("/register", async (req, res) => {
  const { email, password, confirm_password } = req.body
  const result = await create_user(req.body)
  res.send(result)
})

app.get("/confirm/:key", async (req, res) => {
  const key = req.params.key
  const result = await confirm_email(key)
  res.send(result)
})

app.post("/resend_email_confirmation_request", async (req, res) => {
  const { email } = req.body
  const result = await send_email_confirmation_request(email)
  res.send(result)
})

app.post("/reset_password_email_request", async (req, res) => {
  const { email } = req.body
  const result = await reset_password(email)
  res.send(result)
})

app.post("/update_password_with_token", async (req, res) => {
  console.log("POST: update_password_with_token")
  console.log(JSON.stringify(req.body))
  const { password, confirm_password, password_reset_token } = req.body
  // GET THE USER_ID WITH THE TOKEN
  let result = ""
  const user_id = await get_user_id_from_password_token(password_reset_token)
  if (user_id > 0) {
    result = await update_password({ user_id, password, confirm_password })
  } else {
    result = res.send({ success: false, message: "invalid token" })
  }
  res.send(result)
})

app.get("/images/:imageName", (req, res) => {
  console.log("GET: /images:imageName")
  const imageName = req.params.imageName
  if (imageName != null) {
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
  } else {
    res.send("Invalid Image.")
  }
})

app.use(verifyJWT)
/*
   Middleware verifies/decodes auth token and inserts values into the request handler:
   jwt_user_id
   jwt_roles 
*/

// TODO: LIMIT PERMISSIONS ONLY TO THINGS THE USER HAS ACCESS TO
// REGULAR USERS SHOULD ONLY BE ABLE TO ACCESS THEIR OWN INFO
// ADMIN USERS CAN ACCESS ANYTHING

/*
JWT BLCOKING IMAGE REQUESTS?
app.get("/images/:imageName", (req, res) => {
  console.log("GET: /images:imageName")

  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`images/${imageName}`)
  readStream.pipe(res)
})
*/

// MUST BE AN ADMIN TO DO THIS

// TO DO IMPLEMENT THIS
app.get("/delete_user/:user_id", async (req, res) => {
  console.log("GET: /delete_user")
  const user_id = req.params.user_id
  console.log(JSON.stringify(req.body))

  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    console.log("deleting user")
    result = await delete_user({ user_id: user_id })
  }
  res.send(result)
})

app.get("/users", async (req, res) => {
  console.log(`Verified ${req.jwt_user_id} : ${req.jwt_roles}`)
  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    result = await getUsers()
  }
  res.send(result)
})

app.get("/users/:id", async (req, res) => {
  const id = req.params.id
  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    result = await getUser(id)
  }
  res.send(result)
})

app.post("/edit_user_roles", async (req, res) => {
  console.log("POST: /edit_user_roles")
  console.log(JSON.stringify(req.body))
  const { user_id, roles } = req.body
  // MUST BE AN ADMIN TO DO THIS
  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    result = await update_user_roles({ user_id: user_id, roles: roles })
  }

  res.send(result)
})

/* 
THIS IS FOR AN ADMIN CHANGING A USER'S EMAIL ADDRESS.  NOT NORMALLY RECOMMENDED. 
*/
app.post("/edit_user_email", async (req, res) => {
  console.log("POST: /edit_user_email")
  console.log(JSON.stringify(req.body))
  const { user_id, email } = req.body
  // MUST BE AN ADMIN TO DO THIS
  let result = { success: false, message: "Not allowed." }
  if (is_admin(req.jwt_roles)) {
    result = await update_email_address({ user_id: user_id, email: email })
  }

  res.send(result)
})

/* THIS IS FOR A USER CHANGING HIS OWN EMAIL ADDRESS */
app.post("/update_email_address", async (req, res) => {
  console.log("POST: update_email_address")
  console.log(JSON.stringify(req.body))
  const { email } = req.body
  const user_id = req.jwt_user_id
  const result = await update_email_address({
    user_id: req.jwt_user_id,
    email: email,
  })
  res.send(result)
})

app.post("/update_password", async (req, res) => {
  console.log("POST: update_password")
  console.log(JSON.stringify(req.body))
  const { password, confirm_password } = req.body
  const user_id = req.jwt_user_id
  const result = await update_password({ user_id, password, confirm_password })
  res.send(result)
})

/* USER LOG */

getUserActivity
app.get("/userlog", async (req, res) => {
  console.log("GET: /userlog")
  const user_id = req.jwt_user_id
  const result = await getUserActivity({ user_id })
  res.send(result)
})

/* NOTES API */
app.post("/add_note", async (req, res) => {
  console.log("POST: add_note")
  const { note, local_time, timezone, rating, tags } = req.body
  const user_id = req.jwt_user_id
  const result = await addNote({
    user_id,
    note,
    local_time,
    timezone,
    rating,
    tags,
  })
  res.send(result)
})

app.post("/edit_note", async (req, res) => {
  console.log("POST: edit_note")
  const { note_id, note, rating, tags } = req.body
  console.log("TAGS")
  console.log(req.body)
  const user_id = req.jwt_user_id
  const result = await updateNote({ user_id, note_id, note, rating, tags })
  res.send(result)
})

app.post("/delete_note", async (req, res) => {
  console.log("POST: /delete_note")
  const { note_id } = req.body
  const user_id = req.jwt_user_id
  const result = await deleteNote({ user_id, note_id })
  res.send(result)
})

app.get("/notes/:note_id", async (req, res) => {
  console.log("GET: /notes:note_id")
  const note_id = req.params.note_id
  const user_id = req.jwt_user_id
  const result = await getNote({ user_id, note_id })
  res.send(result)
})

app.get("/notes", async (req, res) => {
  console.log("GET: /notes")
  const user_id = req.jwt_user_id
  const result = await getNotes({ user_id })
  res.send(result)
})

app.get("/note_dates", async (req, res) => {
  console.log("GET: /notes")
  const user_id = req.jwt_user_id
  const result = await getNoteDates({ user_id })
  res.send(result)
})

app.get("/tags", async (req, res) => {
  console.log("GET: /tags")
  const result = await getAllTags()
  res.send(result)
})

app.use(express.static("public"))

const port = 3001

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function truncate(str, length) {
  if (str.length > length) {
    return str.slice(0, length) + "..."
  } else return str
}
