const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  Username: {
    type: String,
    unique: true
  },
  FullName: String,
  HashPassword: String,
  Permission: Number, //0-Student, 1-Scientist, 2-Recruitment, 3-Mod, 4-Admin
});

const user = mongoose.model('users',userSchema)

module.exports = user;