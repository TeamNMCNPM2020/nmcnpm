const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  Username: {
    type: String,
    unique: true
  },
  FullName: String,
  HashPassword: String,
  Permission: Number,
});

const user = mongoose.model('users',userSchema)

module.exports = user;