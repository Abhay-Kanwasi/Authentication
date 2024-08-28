import dotenv from 'dotenv'
dotenv.config() 

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/connectdb.js'
import passport from 'passport'
import router from './routes/userRoutes.js'

// Initialization
const app = express()
const port = process.env.PORT
const frontend_host = process.env.FRONTEND_HOST
const database_url = process.env.DB_URL
const database_name = process.env.DB_NAME

const corsOptions = {
    origin: frontend_host,
    credentials: true,
    optionSuccessStatus: 200,
}

// MiddleWares
app.use(cors(corsOptions)) // giving corsOptions to app middleware
connectDB(database_url, database_name) // database connection
app.use(cookieParser())
app.use(express.json()) // json middleware for api creation
app.use(passport.initialize()) 

// Load Routes
app.use("/api/user", router)

app.listen(port, ()=>{
    console.log(`server listening at http://localhost:${port}`)
})