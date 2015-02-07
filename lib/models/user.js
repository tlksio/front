var MongoClient = require('mongodb').MongoClient;

var config = require('../../config.json');

/**
 * Get user profile by its username
 * @param username  User username
 * @param callback  Callback to execute, receives user json object
 */
exports.profile = function (username, callback) {
    "use strict";
    MongoClient.connect(config.mongodb, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var users = db.collection('users');
        users.findOne({"username": username}, function (err, profile) {
            if (err) {
                return callback(err, null);
            }
            callback(null, profile);
        });
    });
};