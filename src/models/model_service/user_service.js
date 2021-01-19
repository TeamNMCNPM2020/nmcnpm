const User = require('../user');
const mongoose = require('mongoose');

module.exports = {
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

    return result
  },
  singleByID: async function(uid) {
    const result = await User.aggregate([
      { $match: {
        '_id': mongoose.Types.ObjectId(uid)
      }},
      { $project: {
        'Username': '$Username',
        'FullName': '$FullName',
        'Permission': '$Permission'
      }}
    ]);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }
  
}