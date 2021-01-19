const Reaction = require('../reaction');
const User = require('../user');
const mongoose = require('mongoose');
const datetime = require('../../utils/datetime');

module.exports = {
  add: async function(entity) {
    console.log(entity);
    let reaction = {
      body: entity.body,
      postTime: datetime.ISODateNow(),
      contentID: (entity.contentID)? mongoose.Types.ObjectId(entity.contentID):null,
      profileID: (entity.profileID)? mongoose.Types.ObjectId(entity.profileID):null,
      author: entity.author
    }
    console.log(reaction);

    return await new Reaction(reaction).save();
  },
  listReaction: async function(id, isProfileID = 0) {
    let filterObj = {};

    if (isProfileID === 0) {
      filterObj.contentID = mongoose.Types.ObjectId(id);
    }
    else {
      filterObj.profileID = mongoose.Types.ObjectId(id);
    }

    console.log(filterObj);

    const result = await Reaction.aggregate([
      { $match: filterObj },
      { $sort: {
          'postTime': -1
        }
      },
      { $lookup: {
          from: User.collection.collectionName,
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: {path: '$author', preserveNullAndEmptyArrays: true}},
      { $project: {
        'body': '$body',
        'postTime': '$postTime',
        'author': {
          '_id': '$author._id',
          'FullName': '$author.FullName'
        },
        'isBlocked': '$isBlocked'
      }}
    ]);

    //Convert ISO string to usable format
    result.map((reaction) => {
      reaction.postTime = datetime.FormatDate(reaction.postTime);
      return reaction;
    });

    return result;
  },
  toggleBlock: async function(reactionID) {
    const reaction = await Reaction.findOne({_id: reactionID});

    let newBlocked = !reaction.isBlocked;
    const result = await Reaction.updateOne({
      _id: reactionID
    }, {
      $set: { isBlocked: newBlocked}
    });

    if (result.ok === 1) {
      return true;
    }
    return false;
  }
}