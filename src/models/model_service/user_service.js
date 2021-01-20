const User = require('../user');
const mongoose = require('mongoose');

module.exports = {
  listSearch: async (search) =>{
      const result = await User.find({
        FullName: new RegExp(search, "i")
      }).lean();
      console.log(result);
      return result;
  },
  add: async function(entity) {

    let newUser = {
      Username: entity.Username,
      FullName: entity.FullName,
      HashPassword: entity.HashPassword,
      Permission: entity.Permission,
    }

    return await new User(newUser).save();
  },
  patchInfo: async function(entity) {
    const condition = entity._id;
    delete entity._id;
    const result = await User.updateOne({
      '_id': condition,
    }, {
      $set: entity
    });

    return (result.ok == 1)?true:false;
  },
  patchPassword: async function(entity) {
    const condition = entity._id;
    delete entity._id;
    const result = await User.updateOne({
      '_id': condition,
    }, {
      $set: {
        HashPassword: entity.HashPassword
      }
    });

    return (result.ok == 1)?true:false;
  },
  list: async function() {
    const result = await User.aggregate([
      { $project: {
        'Username': '$Username',
        'FullName': '$FullName',
        'Permission': '$Permission'
      }}
    ]);

    return result;
  },
  singleByUsername: async function(username) {
    const result = await User.aggregate([
      { $match: {
        'Username': username
      }},
    ]);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  },
  singleByIDAll: async function(uid) {
    if (
      !mongoose.Types.ObjectId.isValid(uid)
      || uid !== String(new mongoose.Types.ObjectId(uid))
    ) {//Filter non valid ids
      return null;
    }
    const result = await User.aggregate([
      { $match: {
        '_id': mongoose.Types.ObjectId(uid)
      }},
    ]);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  },
  singleByID: async function(uid) {
    if (
      !mongoose.Types.ObjectId.isValid(uid)
      || uid !== String(new mongoose.Types.ObjectId(uid))
    ) {//Filter non valid ids
      return null;
    }
    const result = await User.aggregate([
      { $match: {
        '_id': mongoose.Types.ObjectId(uid)
      }},
      // { $unwind: "$friends" },
      // {
      //   $lookup: {
      //     from: User.collection.collectionName,
      //     localField: "friends",
      //     foreignField: "_id",
      //     as: "friends_infor"
      //   }
      // },
      // { "$unwind": "$friends_infor" },
      { $project: {
        // 'friends_infor': "$friends_infor",
        'friends':  "$friends",
        'Username': '$Username',
        'FullName': '$FullName',
        'Permission': '$Permission'
      }}
    ]);

    // result[0].friends_infor = await User.findOne(mongoose.Types.ObjectId(uid)).populate('friends').lean();

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }
  
}