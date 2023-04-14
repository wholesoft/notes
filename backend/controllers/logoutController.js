import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_USERS_DATABASE,
  })
  .promise()

const handleLogout = async (req, res) => {
  // On client, also delete the access_token
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // success, no content
  const refresh_token = cookies.jwt

  const rows = await pool.query(
    `SELECT user_id FROM RefreshTokens WHERE refresh_token=?`,
    [refresh_token]
  )
  console.log("Looking for matching refresh token")
  //console.log(rows);
  if (rows[0].length < 1) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
    return res.sendStatus(204)
  }
  // delete the refresh token in the db
  await pool.query(`DELETE FROM RefreshTokens WHERE refresh_token=?`, [
    refresh_token,
  ])
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }) // secure:  true only serves https
  return res.sendStatus(204)
}

export default { handleLogout }
