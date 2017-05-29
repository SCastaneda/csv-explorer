var mongoose = require('mongoose');
var mongoURI = process.env.MONGOHQ_URL || 'mongodb://localhost/csv';
var db       = mongoose.connect(mongoURI);

var Schema = mongoose.Schema;

var userSchema  = new Schema({
                            "id"     : Number, 
                            "name"   : String, 
                            "age"    : Number, 
                            "address": String, 
                            "team"   : String,
                            "session": String
                        });

userSchema.index(
    {
         "name": "text",
         "address": "text",
         "team": "text"
    },
    {
        "weights": {
            "name": 10,
            "address": 5,
            "team": 4
        }
    }
);

var userModel = mongoose.model('users', userSchema);

function saveUser(user, session) {
    var dbUser = new userModel();
    dbUser.id = user.id;
    dbUser.name = user.name;
    dbUser.age = user.age;
    dbUser.address = user.address;
    dbUser.team = user.team;
    dbUser.session = session;

    dbUser.save(function(err, newUser) {
        if (err) {
            console.error("Error Saving user: " + err);
        }
    });
}

exports.search = function(query, session, cb) {

    var totalLimit = 20;
    var res = [];

    /*
        If this is a number search
        1. check if it's an id
        2. check if it's an age search
        3. do a text search on the number
    */
    var isNumberSearch = !isNaN(+query);
    
    if(isNumberSearch) {
        findById(+query, session, function(err, user) {

            if(user !== null) {
                res = res.concat(user);
            }

            var limit = totalLimit - res.length;

            numberSearch(+query, session, limit, function(err, users) {

                if(users !== null) {
                    res = res.concat(users);
                    console.log("After number search: " + res);
                } else {
                    console.log("Number search came back with null");
                }

                if(res.length != totalLimit)
                {
                    var limit = totalLimit - res.length;
                    textSearch(query, session, limit, function(err, users2) {

                        if(users2 !== null) {
                            res = res.concat(users2);
                        } else {
                            console.log("Text Search came back with null");
                        }

                        console.log("After textSearch: " + res);
                        cb(err, res);
                    });
                } else {
                    cb(err, res);
                }
            });
        });
    } else {
        textSearch(query, session, totalLimit, function(err, users) {
            cb(err, users);
        });
    }
    
};

function findById(id, session, cb) {
    userModel.findOne({"id": id, "session": session}, function(err, user) {
        if(err) {
            console.error(err);
            cb(err, user);
        } else {
            console.log("findById: \n" + user);
            cb(err, user);
        }

    });
}

function numberSearch(number, session, limit, cb) {
    userModel.find({ 'age': number, 'session': session })
    .limit(limit)
    .exec(function(err, users) {
        if(err) {
            console.error(err);
            cb(err, users);
        } else {
            console.log("numberSearch: \n" + users);
            cb(err, users);
        }
    });
}

function textSearch(text, session, limit, cb) {

    userModel.find({ "$text": { "$search": text } })
    .select({ "score": { "$meta": "textScore" } })
    .sort({ "score": { "$meta": "textScore" } })
    .exec(function(err,result) {
        if(err) {
            console.error(err);
            cb(err, {});
        } else {
            console.log("Before session filter:" + result);
            sessionFilter(result, session, limit, function(filteredUsers){
                console.log("After session filter: " + filteredUsers);
                cb(err, filteredUsers);
            });
        }
    });
}

function sessionFilter(resultSet, session, limit, cb) {
    var filteredUsers = [];

    console.log("Filtering through "+resultSet.length+" items");

    for(var i = 0; i < resultSet.length; i++) {
        if(resultSet[i].session == session) {
            filteredUsers.push(resultSet[i]);

            if(filteredUsers.length == limit) {
                return cb(filteredUsers);
            }
        }
    }

    cb(filteredUsers);
}

exports.dropUsers = function(session, cb) {
    userModel.remove({ "session": session }, function(err){
        if(err) {
            console.error(err);
        } else {
            console.log("All users dropped.");
        }
        cb();
    });
};

exports.saveUser = function(user, session) {
    saveUser(user, session);
};
