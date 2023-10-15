import express from "express"
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`App listening on port ${port}. Go to http://localhost:3000`))