'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// uid: 1,
// title: 'Best Thing',
// list : [
//   {key: 'item1', value: 2},
//   {key: 'item2', value: 5},
//   {key: 'item3', value: 9}
// ]};

var Poll = new Schema({
    uid: Number,
    name: String,
    list: [{key: String, value: Number}]
});

module.exports = mongoose.model('Poll', Poll);
