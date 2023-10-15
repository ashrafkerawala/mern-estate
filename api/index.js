import express from "express"
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

mongoose.connect(process.env.url).then(() => {
    console.log('Connected to database')
}).catch((err) => {
    console.log(err)
})

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`App listening on port ${port}. Go to http://localhost:3000`))