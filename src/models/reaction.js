const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema({
  contentID: {//When comments on posts
    type: mongoose.Types.ObjectId,
    ref: 'SingleTopic'
  },
  profileID: {//When comments on people profiles
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  body: String,
  postTime: String,
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  }
});

const reaction = mongoose.model('reactions',reactionSchema)

module.exports = reaction;