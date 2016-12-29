'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// command line mongo
// mongo
// db.polls.insert({"name" : "test poll c", uid:"1631314", list : [ {key : 'item1', value : 0}, {key : 'item2', value : 0} ]})
// db.polls.find()

// clear the database
// db.polls.remove({})

// uid: 1,
// title: 'Best Thing',
// list : [
//   {key: 'item1', value: 2},
//   {key: 'item2', value: 5},
//   {key: 'item3', value: 9}
// ]};

var Poll = new Schema({
    uid: String,
    name: String,
    list: [{key: String, value: Number}]
});

module.exports = mongoose.model('Poll', Poll);
