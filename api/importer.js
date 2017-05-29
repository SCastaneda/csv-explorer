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

exports.importCSV = function(expressTmpFile, session, socket, cb) {

	console.log("Socket: \n" + session);

	// delete previous data
	dbUsers.dropUsers(session, function() {

		var newFileName = "./files/" + session + ".csv";

		var totalFileSize = expressTmpFile.data.length;
		var totalProcessed = 0.0;
		var progress = 0;

		console.log("Total Files Size: " + totalFileSize);

		saveToFile(expressTmpFile, newFileName, function(success) {

			console.log("Start parsing of file, line-by-line");

			if (success) {
				var rl = readline.createInterface({
					input: fs.createReadStream(newFileName)
				});

				rl.on('line', function(line) {
					var csvObj = parse(line);
					dbUsers.saveUser(createUserObject(csvObj[0]), session);

					totalProcessed = totalProcessed + Buffer.byteLength(line);
					var newProgress = Math.floor((totalProcessed / totalFileSize) * 100);

					// only update progress every percent increment
					if (newProgress > progress) {
						progress = newProgress;
						socket.emit("progress", {
							"progress": progress
						});
					}
				});

				rl.on('close', function() {
					console.log("Finished importing file into db");
					socket.emit("complete", {});
					
					// remove file
					fs.unlinkSync(newFileName)

					return cb();
				});

				rl.on('error', function(err) {
					console.error(err);
					return cb(err);
				});

			} else {
				return cb("Could not save to file");
			}

		});
	});


};