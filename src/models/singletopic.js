const mongoose = require('mongoose');

const singleTopicSchema = mongoose.Schema({
  topicName: String
});

const singleTopic = mongoose.model('topics',singleTopicSchema)

module.exports = singleTopic;