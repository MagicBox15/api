const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const cookieParser = require('cookie-parser');
const cors=require("cors");


const PORT = process.env.PORT || 3001;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);

app.use(cors());
app.options('*', cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


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