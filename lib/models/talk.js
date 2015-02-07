var MongoClient = require('mongodb').MongoClient;

var config = require('../../config.json');

exports.latest = function (callback) {
    MongoClient.connect(config.mongodb, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({}).limit(5).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, docs);
        });
    });
};

exports.popular = function (callback) {
    MongoClient.connect(config.mongodb, function(err, db) {
        if (err) {
            return callback(err, null);
        }
        var talks = db.collection('talks');
        talks.find({}).limit(5).toArray(function(err, docs) {
            if (err) {
                return callback(err, null);
            }
            db.close();
            callback(null, docs);
        });
    });
};

exports.create = function (talk, callback) {
    MongoClient.connect(config.mongodb, function(err, db) {
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

exports.get = function (id, callback) {
    MongoClient.connect(config.mongodb, function(err, db) {
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

exports.play = function (id, callback) {
    MongoClient.connect(config.mongodb, function(err, db) {
        var talks = db.collection('talks');
        talks.findOne({"id": id}, function (err, talk) {
            if (err) {
                return callback(err, null);
            }
            talk.views = talk.views+1;
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