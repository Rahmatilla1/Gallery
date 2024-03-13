const express = require("express")
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

const fs = require("fs")
const path = require("path")

const galeryRouter = require("./src/router/GaleryRouter");
const userRouter = require("./src/router/userRouter");

const app = express()


const PORT = process.env.PORT || 4001

// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const removeTemp = (path) => {
    fs.unlink(path, err => {
        if (err) {
            throw err
        }
    }) 
}

// midlawares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({useTempFiles: true}))
app.use(cors())

app.use("/api/gallery", galeryRouter)
app.use("/api/user", userRouter)

app.get('/', (req, res) => {
    res.send("ok")
})

// app.get('/gallery', async (req, res) => {
//     res.send([])
// })

const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL).then(()=> {
    // console.log('connected');
    app.listen(PORT, () =>  console.log(`Server running on port: ${PORT}`))
}).catch(err => console.log(err))
