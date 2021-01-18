const Reaction = require('../reaction');

module.exports = {
  add: async function(entity) {
    let content = {
      body: entity.body,
      postTime: datetime.ISODateNow(),
      contentID: null,
      profileID: null,
      author: null
    }

    return await new Reaction(content).save();
  },
  listReaction: async function(profileOrContentIDOBj) {
    const result = await Reaction.aggregate([
      { $match: profileOrContentIDOBj },
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
    ]);

    //Convert ISO string to usable format
    result.map((reaction) => {
      reaction.postTime = datetime.FormatDate(reaction.postTime);
      return reaction;
    });

    return result;
  },
}