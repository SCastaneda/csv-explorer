var parse = require('csv-parse/lib/sync');
var dbUsers = require('./db/users');

var readline = require('readline');
var fs = require('fs');

function createUserObject(array) {
	var user = {
		"id": +array[0],
		"name": array[1],
		"age": +array[2],
		"address": array[3],
		"team": array[4]
	};

	return user;
}

function saveToFile(expressTmpFile, newFileName, cb) {
	expressTmpFile.mv(newFileName, function(err) {
		if (err) {
			console.error(err);
			return cb(false);
		}
		return cb(true);
	});
}

exports.importCSV = function(expressTmpFile, cb) {

	var newFileName = "./files/large.csv";

	saveToFile(expressTmpFile, newFileName, function(success) {

		console.log("Starting parsing of file, line-by-line");

		if (success) {
			var rl = readline.createInterface({
				input: fs.createReadStream(newFileName)
			});

			rl.on('line', function(line) {
				var csvObj = parse(line);
				dbUsers.saveUser(createUserObject(csvObj[0]));
			});

			rl.on('close', function() {
				console.log("Finished importing file into db");
				return cb();
			});

			rl.on('error', function(err) {
				console.error(err);
				return cb();
			});

		} else {
			return cb("Could not save to file");
		}

	});

};