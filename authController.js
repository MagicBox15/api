const User = require('./models/User');
const bcrypt = require('bcryptjs');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config');
const Password = require('./models/Password');
const { redirect } = require('express/lib/response');

const generateAccessToken = (id, username) => {
  const payload = {
    id,
    username,
  };
  return jwt.sign(payload, secret, {expiresIn: '1h'});
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Invalid entry',
        })
      }

      const { username, password } = req.body;

      const candidate = await User.findOne({username});

      if(candidate) {
        return res.status(400).json({ message: 'User with this name already exists'});
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const user = new User({
        username,
        password: hashPassword,
      });
      await user.save();
      return res.status(200).json({ message: 'User successfully registered' })
      
    }
    catch (error) {
      
      console.log(error);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log(req.body);

      const user = await User.findOne({username});

      if(!user) {
        return res.status(400).json({message: `User '${username}' can't be found`})
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if(!validPassword) {
        return res.status(400).json({message: 'Wrong password. Try again'})
      }

      const token = generateAccessToken(user._id, user.username);
      res.cookie(`token`, {token}, {httpOnly: true, secure: false});
      
      return res.json({message: 'Login success'});
    }
    catch (error) {
      console.log(error);
      res.status(400).json({message: 'Login error'})
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('token');
      res.status(200).json({message: 'You have been logged out '}).redirect('/login')
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Something going wrong'})
    }
  }

  async getPasswords(req, res) {
    try {
      const token = req.cookies.token;

      if(!token) {
        res.status(400).json({message: 'Please log in'}).redirect('/login')
      }
      const decodedToken = jwt.verify(token.token, secret);

      const passwords = await Password.find({userId: decodedToken.id});
      passwords.map(el => {
        const decryptBytes = CryptoJS.AES.decrypt(el.password, secret);
        const decryptPassword = decryptBytes.toString(CryptoJS.enc.Utf8);
        el.password = decryptPassword;
      })
      res.status(200).json(passwords);
    }
    catch (error) {
      console.log(error);
      res.status(400).json({message: 'You don\'t have an access'})
    }
  }

  async postPasswords(req, res) {
    try {
      const token= req.cookies.token;
      if(!token) {
        res.status(400).json({message: 'Please log in'})
      }
      const decodedToken = jwt.verify(token.token, secret);

      const { type, title, password } = req.body;

      const newPas = await Password.findOne({userId: decodedToken.id, title: title});

      if(newPas) {
        return res.status(400).json({ message: 'Title should be unique'});
      }

      const hashPassword = CryptoJS.AES.encrypt(password, secret).toString();

      const newPassword = new Password({
        userId: decodedToken.id,
        type,
        title,
        password: hashPassword,
      })
      await newPassword.save();
      return res.json({message: 'Password was successfully created'})
    }
    catch (error) {
      console.log(error);
      res.status(400).json({message: 'Something going wrong'})
    }
  }
// долго грузит страницу после обновления или удаления данных
// редирект делает кучу запросов
  async deleteOnePassword(req, res) {
    try {
      await Password.deleteOne({
       _id: req.body.id,
      })
      redirect('/passwords')
     } catch (error) {
      console.log(error)
     }
  }

  async updatePassword(req, res) {
    try {
      const { id, title, password } = req.body;

      const hashPassword = CryptoJS.AES.encrypt(password, secret).toString();

      await Password.updateOne({_id: id}, {
        title: title,
        password: hashPassword,
      })
     } catch (error) {
      console.log(error)
     }
  }
}

module.exports = new authController();
