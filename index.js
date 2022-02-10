const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(authRouter);

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://MagicBox:qwe123@cluster0.ea79a.mongodb.net/test?retryWrites=true&w=majority')
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  }
  catch (error) {
    console.log(error);
  }
}

start();