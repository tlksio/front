var MongoClient = require('mongodb').MongoClient;

var config = require('../../config.json');

/**
 * Get user profile by its username
 * @param username  User username
 * @param callback  Callback to execute, receives user json object
 */
exports.getByUsername = function (username, callback) {
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
            db.close();
            callback(null, profile);
        });
    });
};

/**
 * Create a user
 * @param user      User json obj
 * @param callback  Callback to execute, receives user json object
 */
exports.create = function (user, callback) {
    "use strict";
    MongoClient.connect(config.mongodb, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var users = db.collection('users');
        users.insert(user, function (err, user) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, user);
        });
    });
};

/**
 * Update existing user
 * @param user      User json obj
 * @param callback  Callback to execute, receives user json object
 */
exports.update = function (user, callback) {
    "use strict";
    MongoClient.connect(config.mongodb, function (err, db) {
        if (err) {
            return callback(err);
        }
        var users = db.collection('users');
        users.update({"id": user.id}, {
            $set: {
                bio: user.bio,
                email: user.email,
                updated: Date.now()
            }
        }, function (err) {
            if (err) {
                return callback(err);
            }
            db.close();
            callback(null);
        });
    });
};