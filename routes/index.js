var express = require('express');
var router = express.Router();
var importer = require('../api/importer');
var dbUsers = require('../api/db/users');

var progressSockets = {};

var appPort;

router.setSocketIO = function(io) {

	io.on('connection', function(socket) {

		socket.emit('getSession', {});

		socket.on('session', function(data) {
			var session = data.session;
			if (session === undefined || session.length === 0) {
				var uuid = require('uuid/v4');
				session = uuid();

				socket.emit('setSession', {
					"session": session
				});

				console.log("New session created: " + session);
				progressSockets[session] = socket;
			} else {
				console.log("Existing session connected: " + session);
				progressSockets[session] = socket;
			}

			printSockets()
		});
		
	});

};

function printSockets() {
	
	console.log(Object.keys(progressSockets));
	
}

function disconnectProgressSocket(session) {
	console.log("Session removed: " + session);
	progressSockets[session].disconnect();
	delete progressSockets[session];
}

router.setAppPort = function(port) {
	appPort = port;
};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		port: appPort
	});
});

router.post('/import', function(req, res, next) {
	if (!req.files) {
		return res.status(400).send('No files were uploaded.');
	}

	var csvFile = req.files.csv;
	var session = req.body.session;

	console.log("/import - session: " + session);
	res.json({
		"success": true,
		"session": session
	});

	var progressSocket = progressSockets[session];

	// pass in the socket to update the client of the progress
	importer.importCSV(csvFile, session, progressSocket, function(err) {
		if (err) {
			console.error(err);
		}
		//disconnectProgressSocket(session);
	});

});

router.post('/search', function(req, res, next) {
	console.log(req.body);

	if (req.body.query === null || req.body.query.length === 0) {
		console.error("No query provided");
		return res.json({});
	}

	if (req.body.session === null || req.body.session.length === 0) {
		console.error("No session provided");
		return res.json({
			"error": "no session provided"
		});
	}

	dbUsers.search(req.body.query, req.body.session, function(err, users) {
		res.json(users);
	});
});


module.exports = router;