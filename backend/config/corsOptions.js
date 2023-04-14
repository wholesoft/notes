import dotenv from "dotenv"
dotenv.config()

const allowedOrigins = [process.env.CORS_ALLOWED_ORIGIN]

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  optionsStuccessStatus: 200,
}

export default corsOptions
