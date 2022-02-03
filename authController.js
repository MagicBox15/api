const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config');
const Password = require('./models/Password');

const generateAccessToken = (id, username) => {
  const payload = {
    id,
    username,
  };
  return jwt.sign(payload, secret, {expiresIn: '12h'});
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Registration error',
          errors
        })
      }

      const { username, password } = req.body;

      const candidate = await User.findOne({username});

      if(candidate) {
        return res.status(400).json({ message: 'User with this name already exists'})
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const user = new User({
        username,
        password: hashPassword,
      });
      await user.save();
      return res.json({message: 'User successfully registered'})
      
    }
    catch (error) {
      console.log(error);
      res.status(400).json({message: 'Registration error'});
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({username});

      if(!user) {
        return res.status(400).json({message: `User '${username}' can't be found`})
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if(!validPassword) {
        return res.status(400).json({message: 'Wrong password. Try again'})
      }

      const token = generateAccessToken(user._id);
      return res.json({token});
    }
    catch (error) {
      console.log(error);
      res.status(400).json({message: 'Login error'})
    }
  }

  async getPasswords(req, res) {
    try {
      // const { username } = req.body
      // const passwords = await Password.find({username});
      // res.json(passwords);
    }
    catch (error) {
      console.log(error);
      res.status(400).json({message: 'You haven\'t access'})
    }
  }

  async postPasswords(req, res) {
    try {
      const { type, title, password } = req.body;

      const hashPassword = bcrypt.hashSync(password, 7);

      const newPassword = new Password({
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
}

module.exports = new authController();
