import express from "express"
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

dotenv.config();

const userName = encodeURIComponent(process.env.username_db);
const password = encodeURIComponent(process.env.password_db);
const cluster = process.env.cluster_db;
const clusterName = process.env.clusterName_db;

const DB_URL = `mongodb+srv://${userName}:${password}@${cluster}/${clusterName}?retryWrites=true&w=majority`

mongoose.connect(DB_URL).then(() => {
    console.log('Connected to database')
}).catch((err) => {
    console.log(err)
})

const app = express()
const port = 3000

app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

// middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(port, () => console.log(`App listening on port ${port}. Go to http://localhost:3000`))