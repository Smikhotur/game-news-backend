const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const authRouter = require('./routes/auth.routes');
const path = require('path');
const app = express();
const PORT = config.get('serverPort');

app.use(cors({origin: '*'}));
app.use(express.json({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRouter);
// app.use('/api/files', fileRouter);

const start = async () => {
  try {
    await mongoose.connect(config.get('bdUrl'))
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    });
  } catch (e) {

  }
};

start();
