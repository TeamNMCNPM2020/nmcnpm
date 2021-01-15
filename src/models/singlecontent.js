const mongoose = require('mongoose');

const singleContentSchema = mongoose.Schema({
  typeID: {
    type: mongoose.Types.ObjectId,
    ref: 'ContentType'
  },
  topicID: {
    type: mongoose.Types.ObjectId,
    ref: 'SingleTopic'
  },
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