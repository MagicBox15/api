const { Schema, model } = require('mongoose');

const Password = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  type: {type: String, unique: true, required: true},
  title: {type: String, unique: true, required: true},
  password: {type: String, required: true}
});

module.exports = model('Passwod', Password);
