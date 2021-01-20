const mongoose = require('mongoose');

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = mongoose.Schema({
  Username: {
    type: String,
    unique: true
  },
  FullName: String,
  HashPassword: String,
  Permission: Number, //0-Student, 1-Scientist, 2-Recruitment, 3-Mod, 4-Admin
  friends: [{ type: ObjectId, ref: 'users' }],
});

const user = mongoose.model('users',userSchema);

module.exports = user;