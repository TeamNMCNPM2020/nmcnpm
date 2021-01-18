const SingleTopic = require('../singletopic');
const mongoose = require('mongoose');

module.exports = {
  //List all topics
  list: async function() {
    return await SingleTopic.aggregate([
      {$project: {
        '_id': '$_id',
        'topicName': '$topicName'
      }}
    ]);
  },
  add: async function(entity) {
    return await new SingleTopic(entity).save();
  },
  patch: async function(entity) {
    const condition = entity._id;
    delete entity._id;
    const result = await SingleTopic.updateOne({
      '_id': condition
    }, {
      $set: {
        'topicName': entity.topicName
      }
    });

    if (result.ok) {
      return true;
    }

    return false;
  },
  del: async function(topicID) {
    const condition = topicID;
    //TODO: [Block delete if there are content in this topic] or [soft delete]
    const result = await SingleTopic.deleteOne({
      '_id': condition
    });

    if (result.ok) {
      return true;
    }

    return false;
  }
}