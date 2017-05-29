var express = require('express');
var router = express.Router();
var importer = require('../api/importer');
var dbUsers = require('../api/db/users');

// broadcast info to all sockets
var progressSockets;
var appPort;

router.setSocketIO = function(io) {

	io.on('connection', function(socket) {
		
	});
	progressSockets = io.sockets;
};

router.setAppPort = function(port) {
	appPort = port;
};

// SPA - all the front end is handles in index.ejs
router.get('/', function(req, res, next) {
	res.render('index', {
		port: appPort // pass in the correct port for socket.io
	});
});


// Backend route to upload the CSV file to the database
router.post('/import', function(req, res, next) {
	if (!req.files) {
		return res.status(400).send('No files were uploaded.');
	}

	var csvFile = req.files.csv;

	// pass in the socket to update the client of the progress
	importer.importCSV(csvFile, progressSockets, function(err) {
		if (err) {
			return res.status(500).json({"success": false, "error": err});
		}

		res.json({ "success": true });
	});

});

// Backend route to search the database
router.post('/search', function(req, res, next) {
	console.log(req.body);
	dbUsers.search(req.body.query, function(err, users) {
		res.json(users);
	});
});


module.exports = router;