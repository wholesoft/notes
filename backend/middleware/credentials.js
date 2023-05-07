import dotenv from "dotenv"
dotenv.config()

//const allowedOrigins = [process.env.CORS_ALLOWED_ORIGIN]
const allowedOrigins = process.env.CORS_ALLOWED_ORIGIN.split(",")

const credentials = (req, res, next) => {
  const origin = req.headers.origin
  //console.log("FAILS HERE:")
  //console.log(origin)
  //console.log("ALLOWED:")
  //console.log(allowedOrigins)

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true)
  }
  next()
}

export default credentials
