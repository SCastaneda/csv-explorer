var mongoose = require('mongoose');
var mongoURI = process.env.MONGOHQ_URL || 'mongodb://localhost/csv';
var db       = mongoose.connect(mongoURI);

var Schema = mongoose.Schema;

var userSchema  = new Schema({
                            "id"     : Number, 
                            "name"   : String, 
                            "age"    : Number, 
                            "address": String, 
                            "team"   : String
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

function saveUser(user) {
    var dbUser = new userModel();
    dbUser.id = user.id;
    dbUser.name = user.name;
    dbUser.age = user.age;
    dbUser.address = user.address;
    dbUser.team = user.team;

    dbUser.save(function(err, newUser) {
        if (err) {
            console.error("Error Saving user: " + err);
        }
    });
}

exports.search = function(query, cb) {

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
        findById(+query, function(err, user) {

            if(user !== null) {
                res = res.concat(user);
            }

            var limit = totalLimit - res.length;

            numberSearch(+query, limit, function(err, users) {

                if(users !== null) {
                    res = res.concat(users);
                }

                if(res.length != totalLimit)
                {
                    var limit = totalLimit - res.length;
                    textSearch(query, limit, function(err, users2) {

                        if(users2 !== null) {
                            res = res.concat(users2);
                        }
                        cb(err, res);
                    });
                } else {
                    cb(err, res);
                }
            });
        });
    } else {
        textSearch(query, totalLimit, function(err, users) {
            cb(err, users);
        });
    }
    
};

function findById(id, cb) {
    userModel.findOne({"id": id}, function(err, user) {
        if(err) {
            console.error(err);
            cb(err, user);
        } else {
            console.log("findById: \n" + user);
            cb(err, user);
        }

    });
}

// search number fields other than the id (age)
function numberSearch(number, limit, cb) {
    userModel.find({ 'age': number })
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

function textSearch(text, limit, cb) {
    userModel.find({ "$text": { "$search": text } })
    .select({ "score": { "$meta": "textScore" } })
    .sort({ "score": { "$meta": "textScore" } })
    .limit(limit)
    .exec(function(err,result) {
        if(err) {
            console.error(err);
            cb(err, {});
        } else {
            console.log(result);
            cb(false, result);
        }
    });
}

exports.dropUsers = function(cb) {
    userModel.remove({}, function(err){
        if(err) {
            console.error(err);
        } else {
            console.log("All users dropped.");
        }
        cb();
    });
};

exports.saveUser = function(user) {
    saveUser(user);
};
