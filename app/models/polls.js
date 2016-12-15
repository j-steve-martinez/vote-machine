'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    userId: String,
    name: String,
    list: []
});

module.exports = mongoose.model('Poll', Poll);
