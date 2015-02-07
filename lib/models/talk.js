var MongoClient = require('mongodb').MongoClient;

var config = require('../../config.json');

/**
 * Get latest talks
 * @param quantity  Number of talks to get
 * @param callback  Callback to execute, receives a list of talk json objects
 */
exports.latest = function (quantity, callback) {
    MongoClient.connect(config.mongodb, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({}).sort({id: -1}).limit(quantity).toArray(function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, docs);
        });
    });
};

/**
 * Get popular talks
 * @param callback  Callback to execute, receives a list of talk json objects
 */
exports.popular = function (quantity, callback) {
    MongoClient.connect(config.mongodb, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({}).sort({views: -1}).limit(quantity).toArray(function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, docs);
        });
    });
};

/**
 * Create a talk
 * @param talk      Talk json object
 * @param callback  Callback to execute, receives talk json object
 */
exports.create = function (talk, callback) {
    MongoClient.connect(config.mongodb, function (err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.insert(talk, function (err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, docs);
        });
    });
};

/**
 * Get a talk by its ID
 * @param id        Talk id
 * @param callback  Callback to execute, receives talk json object
 */
exports.get = function (id, callback) {
    MongoClient.connect(config.mongodb, function (err, db) {
        var talks = db.collection('talks');
        talks.findOne({"id": id}, function (err, talk) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, talk);
        });
    });
};

/**
 * Play a talk
 * Updates views field by 1.
 * @param id        Talk id
 * @param callback  Callback to execute, receives talk json object
 */
exports.play = function (id, callback) {
    MongoClient.connect(config.mongodb, function (err, db) {
        var talks = db.collection('talks');
        talks.findOne({"id": id}, function (err, talk) {
            if (err) {
                return callback(err, null);
            }
            talk.views = talk.views + 1;
            talks.update({"id": id}, talk, function (err) {
                if (err) {
                    return callback(err, null);
                }
                db.close();
                callback(null, talk);
            });
        });
    });
};