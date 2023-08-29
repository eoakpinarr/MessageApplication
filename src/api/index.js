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
const Message = require("./models/message")

//Kullanıcı kaydı
app.post('/register', (req, res) => {
  const { name, email, password, rePassword, image } = req.body;

  //Yeni kullanıcı oluştur
  const newUser = new User({ name, email, password, rePassword, image });

  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: 'Kullanıcı kaydı başarılı' });
    })
    .catch(error => {
      console.log('Error registering user', error);
      res.status(500).json({ error: 'Kayıt sırasında hata oluştu!' });
    });
  //save User database

});

//Kullanıcı Girişi
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  //Email ve şifre kontrolü
  if (!email || !password) {
    return res.status(404).json({ message: 'Email ve şifre girmek zorunlu!' });
  }

  //Kullanıcıyı veri tabanında aramak
  User.findOne({ email })
    .then(user => {
      if (!user) {
        //Kullanıcı bulunamadı
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      //Veri tabanındaki şifre ile girilen şifreyi karşılaştır
      if (user.password !== password) {
        return res.status(404).json({ message: 'Şifre yanlış!' });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch(error => {
      console.log('Error finding the user', error);
      res.status(500).json({ error: 'Server hatası!' });
    });
});

//Kullanıcı için token oluşturma
const createToken = userId => {
  //set the token payload
  const payload = {
    userId: userId,
  };

  //Tokeni güvenli olarak şifreleme
  const token = jwt.sign(payload, 'Q$r2K6W8n!jCW%Zk', { expiresIn: '1h' });

  return token;
};

//Giriş yapmış olan kullanıcı hariç tüm kullanıcıların listelenmesi
app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId
  User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
    res.status(200).json(users)
  }).catch((error) => {
    console.log("Error: ", error)
    res.status(500).json({ error: "Kullanıcıları getirirken hata oluştu." })
  })

})

//Kullanıcıya istek göndermek
app.post("/friend-request", async (req, res) => {

  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequest: currentUserId }
    })

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sendFriendRequest: selectedUserId }
    })
    res.sendStatus(200)
  } catch (error) {
    console.log("Error", error)
    res.sendStatus(500)
  }
})

//Bütün arkadaşlık isteklerini görüntüle
app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    //Kullanıcı ıd ile kullanıcı verilerini çekmek
    const user = await User.findById(userId).populate("friendRequest", "name email image").lean()

    const friendRequest = user.friendRequest
    res.json(friendRequest)

  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ error: "Server hatası", error })
  }
})

//İstek kabul etmek
app.post("/friend-request/accept", async (req, res) => {

  try {
    const { senderId, recepientId } = req.body

    //Gönderenin ve kullanıcının verilerini al
    const sender = await User.findById(senderId)
    const recepient = await User.findById(recepientId)
    await sender.friends.push(recepientId)
    await recepient.friends.push(senderId)
    recepient.friendRequest = recepient.friendRequest.filter(
      (request) => request.toString() !== senderId.toString()
    )
    sender.sendFriendRequest = sender.sendFriendRequest.filter(
      (request) => request.toString() !== recepientId.toString()
    )
    await sender.save()
    await recepient.save()
    res.status(200).json({ message: "Arkadaşlık isteği kabul edildi." })
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ error: "Server Error: " })
  }
})

//Arkadaş listeleme
app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).populate(
      "friends", "name email image"
    )
    const acceptedFriends = user.friends
    res.json(acceptedFriends)
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ error: "Server hatası" })
  }
})

//Mesaj gönderip veri tabanında saklamak

const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/images')  // Yüklenecek dosyaların saklanacağı klasör
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)  // Dosya adı belirleme
  }
});

const upload = multer({ storage: storage })

app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;
    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timeStamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null
    })
    await newMessage.save()
    res.status(200).json({ message: "Message send succesfully" })
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({message: "Server hatası"})
  }
})

//Kullanıcı detaylarını sayfa tasarımı için almak
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    //kullanıcı bilgilerini id den çekmek
    const recepientId = await User.findById(userId)
    res.json(recepientId)
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ error: "Server hatası" })
  }
})

//iki kullanıcının mesajlarını veri tabanından çekme 
app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const{senderId, recepientId} = req.params;
    const messages = await Message.find({
      $or: [
        {senderId: senderId, recepientId:recepientId},
        {senderId: recepientId, recepientId: senderId}
      ]
    }).populate("senderId", "_id name")
    res.json(messages)
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({error: "Server hatası"})
  }
})

//Mesaj silmek
app.post("/deleteMessages", async (req, res) => {
  try {
    const {messages} = req.body
    if(!Array.isArray(messages) || messages.length === 0){
      return res.status(404).json({message: "Mesaj bulunamadı, geçersiz istek."})
    }
    await Message.deleteMany({_id: {$in: messages}})
    res.json({message: "Mesaj başarılı bir şekilde silindi."})
  } catch (error) {
    console.log("Hata: ", error)
    res.status(500).json({message: "Server hatası"})
  }
})

app.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const {userId} = req.params
    const user = await User.findById(userId).populate("sendFriendRequests", "name email image").lean()
    const sendFriendRequest = user.sendFriendRequest
    res.json(sendFriendRequest)
  } catch (error) {
    console.log("Hata: ", error)
    res.status(500).json({message: "Hata"})
  }
})

app.get("/friends/:userId", (req, res) => {
  try {
    const {userId} = req.params
    User.findById(userId).populate("friends").then((user) => {
      if(!user) {
        return res.status(404).json({message: "Kullanıcı bulunamadı 404"})
      }
      const friendIds = user.friends.map(friend => friend._id)
      res.status(200).json(friendIds)
    })
  } catch (error) {
    console.log("Error", error)
    res.status(500).json({message: "Hata, server hatası."})
  }
})