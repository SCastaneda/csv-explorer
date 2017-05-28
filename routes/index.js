var express = require('express');
var router = express.Router();
var importer = require('../api/importer');
var dbUsers = require('../api/db/users');

var progressSocket;
var appPort;

router.setSocketIO = function(io) {

	io.on('connection', function(socket) {
		progressSocket = socket;
	});

};

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

	// pass in the socket to update the client of the progress
	importer.importCSV(csvFile, progressSocket, function(err) {
		if (err) {
			return res.status(500).json({"success": false, "error": err});
		}

		progressSocket.disconnect(true);
		res.json({ "success": true });
	});

});

router.post('/search', function(req, res, next) {
	console.log(req.body);
	dbUsers.search(req.body.query, function(err, users) {
		res.json(users);
	});
});


module.exports = router;