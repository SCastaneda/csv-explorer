var express = require('express');
var router = express.Router();
var importer = require('../api/importer');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'CSV'
	});
});

router.post('/import', function(req, res, next) {
	if (!req.files) {
		return res.status(400).send('No files were uploaded.');
	}

	var csvFile = req.files.csv;

	importer.importCSV(csvFile, function(err) {
		if (err) {
			return res.status(500).send(err);
		}

		res.send('File uploaded!');
	});

});

router.post('/search', function(req, res, next) {

});


module.exports = router;