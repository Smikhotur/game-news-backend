const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./routes/auth.routes');
const gamesRouter = require('./routes/games.router');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messeges');
const errorMiddleware = require('./middleware/error-midddleware');
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api/auth', authRouter);
app.use('/api/game', gamesRouter);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use(errorMiddleware);
app.use(cookieSession({
  name: 'session',
  keys:['lama'],
  maxAge: 24 * 60 * 60 * 100,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connetion Successfull");
    })
    .catch((e) => {
      console.log(e.message);
    });

  const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  });

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  }
});

let users = [];

const addUser = (userId, socketId) => {
  const result = users.some((user) => {
    if (user.userId === userId) {
      user.socketId = socketId
    }
    return user.userId === userId
  });

  if (!result) users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
  console.log("a user connected.");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  socket.on("sendMessage", ({senderId, receiverId, text, avatar}) => {
    const user = getUser(receiverId);
    console.log('user', user);

    io.to(user?.socketId).emit("getMessage", {
      receiverId,
      senderId,
      text,
      avatar,
    });
    io.emit("getUsers", users);
  });

  socket.on("sendEditMessage", ({receiverId, messageId, text}) => {
    const user = getUser(receiverId);
    console.log(receiverId, messageId, text);

    io.to(user?.socketId).emit("getEditMessage", {
      messageId,
      text,
    });
  });

  socket.on("deleteMessageSocket", ({messageId, receiverId}) => {
    const user = getUser(receiverId);
    console.log(receiverId, messageId);

    io.to(user?.socketId).emit("deleteMessage", {
      messageId,
    });
  });

  socket.on("remove", () => {
    console.log("a user disconnect")
    removeUser(socket.id);
    // console.log(socket.id);
    console.log(users);
    console.log(socket.id);
    io.emit("getUsers", users);
  });
});

