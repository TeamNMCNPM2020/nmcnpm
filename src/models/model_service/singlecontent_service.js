const SingleContent = require('../singlecontent');
const mongoose = require('mongoose');
const datetime = require('../../utils/datetime');

module.exports = {
  add: async function(entity) {
    let content = {
      title: entity.title,
      body: entity.body,
      postTime: datetime.ISODateNow(),
      typeID: null,
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
    }, entity);
  },
  //type: 0-Forum, 1-News, 2-Oppor 
  listContent: async function(type = 0) {
    const result = await SingleContent.aggregate([
      { $match: {
          'typeID': type,
        }
      },
      { $project: {
        '_id': '$_id',
        'title': '$title',
        'postTime': '$postTime',
      }}
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
      }}
    ]);

    console.log(result);

    if (result !== []) {
      const content = result[0];
      content.postTime = datetime.FormatDate(content.postTime);
      return content;
    }

    return null;
  }
}