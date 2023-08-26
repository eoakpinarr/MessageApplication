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

const User = require("./models/user")

//registration user
app.post('/register', (req, res) => {
    const {name, email, password, image} = req.body;
  
    //create a new User object
    const newUser = new User({name, email, password, image});
  
    //save User database
    newUser
      .save()
      .then(() => {
        res.status(200).json({message: 'User registered succesfully'});
      })
      .catch(error => {
        console.log('Error registering user', error);
        res.status(500).json({message: 'Error registering the User!'});
      });
  });

  //logging in of that particular user
app.post('/login', (req, res) => {
    const {email, password} = req.body;
  
    //check if the email and password are provided
    if (!email || !password) {
      return res.status(404).json({message: 'Email and password are required!'});
    }
  
    //check for that user in the database
    User.findOne({email})
      .then(user => {
        if (!user) {
          //user not found
          return res.status(404).json({message: 'User not found'});
        }
  
        //compare the provided password with the password in the database
        if (user.password !== password) {
          return res.status(404).json({message: 'Invalid Password!'});
        }
  
        const token = createToken(user._id);
        res.status(200).json({token});
      })
      .catch(error => {
        console.log('Error finding the user', error);
        res.status(500).json({message: 'Internal Server Error!'});
      });
  });

  //function to create a token for the user
const createToken = userId => {
    //set the token payload
    const payload = {
      userId: userId,
    };
  
    //generate the token with a secret key and expiration time
    const token = jwt.sign(payload, 'Q$r2K6W8n!jCW%Zk', {expiresIn: '1h'});
  
    return token;
  };