import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./db/dataBase.js"
import {errorHandler} from "./middlewares/error.middleware.js"

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    })
)
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

import authRouter from "./routes/auth.route.js"
import bookRouter from "./routes/book.route.js"

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/books", bookRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 8000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port: http://localhost:${PORT}`)
    })
})
.catch((err) => {
    console.error(`MongoDB connection failed: ${err}`)
    process.exit(1)
})