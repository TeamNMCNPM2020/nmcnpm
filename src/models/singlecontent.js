const mongoose = require('mongoose');

const singleContentSchema = mongoose.Schema({
  typeID: Number,   //0: Forum, 1: News, 2: Job
  topicID: {
    type: mongoose.Types.ObjectId,
    ref: 'SingleTopic'
  },
  img : String,
  title: String,
  body: String,
  postTime: String,
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  }
});

const singleContent = mongoose.model('contents',singleContentSchema)

module.exports = singleContent;