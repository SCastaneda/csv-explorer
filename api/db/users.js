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

exports.saveUsers = function(users, cb) {

    for(var i = 0; i < users.length; i++)
    {
        console.log(user[i]);
        saveUser(user[i]);
    }

    cb();
};

exports.saveUser = function(user) {
    saveUser(user);
};
