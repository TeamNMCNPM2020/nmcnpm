const SingleContent = require('../singlecontent');
const SingleTopic = require('../singletopic');
const mongoose = require('mongoose');
const datetime = require('../../utils/datetime');

module.exports = {
  add: async function(entity) {
    let content = {
      title: entity.title,
      body: entity.body,
      postTime: datetime.ISODateNow(),
      typeID: entity.typeID,
      topicID: null,
      author: null
    }

    return await new SingleContent(content).save();
  },
  patch: async function(entity) {
    const condition = entity._id;
    delete entity._id;

    return await SingleContent.updateOne({
      '_id': condition,
    }, {
      $set: entity
    });
  },
  //type: 0-Forum, 1-News, 2-Oppor 
  listContent: async function(type = 0) {
    const result = await SingleContent.aggregate([
      { $match: {
          'typeID': type,
        }
      },
      { $sort: {
          'postTime': -1
        }
      },
      { $lookup: {
          from: SingleTopic.collection.collectionName,
          localField: 'topicID',
          foreignField: '_id',
          as: 'topic'
        }
      },
      { $unwind: {path: '$topic', preserveNullAndEmptyArrays: true}},
      { $project: {
        '_id': '$_id',
        'title': '$title',
        'postTime': '$postTime',
        'topicID': '$topicID',
        'topicName': '$topic.topicName'
      }},
      
    ]);

    //Convert ISO string to usable format
    result.map((content) => {
      content.postTime = datetime.FormatDate(content.postTime);
      return content
    });

    return result;
  },
  singleByID: async function(contentID) {
    if (
      !mongoose.Types.ObjectId.isValid(contentID)
      || contentID !== String(new mongoose.Types.ObjectId(contentID))
    ) {//Filter non valid ids
      return null;
    }
    const result = await SingleContent.aggregate([
      { $match: {
        '_id': mongoose.Types.ObjectId(contentID)
        }
      },
      { $lookup: {
        from: SingleTopic.collection.collectionName,
        localField: 'topicID',
        foreignField: '_id',
        as: 'topic'
        }
      },
      { $unwind: {path: '$topic', preserveNullAndEmptyArrays: true}},
      { $project: {
        '_id': '$_id',
        'title': '$title',
        'postTime': '$postTime',
        'body': '$body',
        'topicID': '$topicID',
        'topicName': '$topic.topicName',
        'typeID': '$typeID'
        }
      }
    ]);

    if (result.length > 0) {
      const content = result[0];
      content.postTime = datetime.FormatDate(content.postTime);
      return content;
    }

    return null;
  }
}