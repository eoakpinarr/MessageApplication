const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local").LocalStrategy

const app = express()
const port = 8000
const cors = require("cors")
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
const jwt = require("jsonwebtoken")

mongoose.connect("mongodb+srv://ogulcanakpinarrr:h3673m33c7.O@cluster0.lr25cww.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB bağlantısı başarılı!")
}).catch((error) => {
    console.log("Error connecting to MongoDB: ", error)
})

app.listen(port, () => {
    console.log("Server", port, "portunda çalışıyor")
})