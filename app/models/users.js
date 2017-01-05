'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
		provider: String,
		username: String,
		id: String,
		uid : String,
		data : {
			id: String,
			displayName: String,
			username: String
		}
});

module.exports = mongoose.model('User', User);

// { _id: 586e927bf58399644a01c270,
//   __v: 0,
//   twitter:
//    { displayName: 'Critical Roach',
//      username: 'critical_roach',
//      id: '243224486' } }
// { _id: 586e97a4a5a29165fa08a3c2,
//   __v: 0,
//   github:
//    { publicRepos: 13,
//      displayName: null,
//      username: 'j-steve-martinez',
//      id: '1631316' } }
