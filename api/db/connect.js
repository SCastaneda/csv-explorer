var mongoose = require('mongoose');
var mongoURI = process.env.MONGOHQ_URL || 'mongodb://localhost/csv';
var db       = mongoose.connect(mongoURI);

exports.schema   = mongoose.Schema;
exports.mongoose = mongoose;