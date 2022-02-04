const { Schema, model } = require('mongoose');

const Password = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  type: {type: String, required: true},
  title: {type: String, unique: true, required: true},
  password: {type: String, required: true}
});

module.exports = model('Password', Password);
