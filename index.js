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

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    });
  } catch (e) {
    console.log(e)
  }
};

start();
