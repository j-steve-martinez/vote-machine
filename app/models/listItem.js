'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListItem = new Schema({
    uid: Number,
    key: String,
    value: Number
});

module.exports = mongoose.model('ListItem', ListItem);
