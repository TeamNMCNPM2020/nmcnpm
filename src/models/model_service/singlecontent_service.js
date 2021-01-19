const SingleContent = require('../singlecontent');
const SingleTopic = require('../singletopic');
const Reaction = require('../reaction');
const User = require('../user');
const mongoose = require('mongoose');
const datetime = require('../../utils/datetime');

module.exports = {
  add: async function(entity) {
    let content = {
      title: entity.title,
      body: entity.body,
      postTime: datetime.ISODateNow(),
      typeID: entity.typeID,
      topicID: mongoose.Types.ObjectId(entity.topicID),
      author: mongoose.Types.ObjectId(entity.author)
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
  listContent: async function(type = 0, topicID = 0) {
    let matchObj = {
      'typeID': type,
    };

    if (topicID != 0) {
      if (
        !mongoose.Types.ObjectId.isValid(topicID)
        || topicID !== String(new mongoose.Types.ObjectId(topicID))
      ) {//Filter non valid ids
        return null;
      }
      matchObj.topicID = mongoose.Types.ObjectId(topicID);
    }

    const result = await SingleContent.aggregate([
      { $match: matchObj
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
      { $lookup: {
          from: User.collection.collectionName,
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $lookup: {
          from: Reaction.collection.collectionName,
          localField: '_id',
          foreignField: 'contentID',
          as: 'reactions'
        }
      },
      { $unwind: {path: '$topic', preserveNullAndEmptyArrays: true}},
      { $unwind: {path: '$author', preserveNullAndEmptyArrays: true}},
      { $project: {
        '_id': '$_id',
        'title': '$title',
        'postTime': '$postTime',
        'topicID': '$topicID',
        'topicName': '$topic.topicName',
        'author': {
          '_id': '$author._id',
          'FullName': '$author.FullName'
        },
        reactionCount: { $size: '$reactions' }
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
      { $lookup: {
          from: User.collection.collectionName,
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: {path: '$topic', preserveNullAndEmptyArrays: true}},
      { $unwind: {path: '$author', preserveNullAndEmptyArrays: true}},
      { $project: {
        '_id': '$_id',
        'title': '$title',
        'postTime': '$postTime',
        'body': '$body',
        'topicID': '$topicID',
        'topicName': '$topic.topicName',
        'typeID': '$typeID',
        'author': {
            '_id': '$author._id',
            'FullName': '$author.FullName'
          }
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