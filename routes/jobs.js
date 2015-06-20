var express = require('express');
var router = express.Router({mergeParams:true});

var Job = require('../models/job');
var User = require('../models/user');

/* GET index the jobs for a single list */
router.get('/', function(req, res, next) {
	var listId = req.params.list_id;
	if(!listId){
		res.status(401);
		res.json({ message: "Need listid" });
		return;
	}
	Job.find({ list: listId }, function(err, jobs) {
		res.json({ jobs: jobs });
	});
});

/* POST create a new job */
router.post('/', function(req, res) {
	var listId = req.params.list_id;
	if(!listId){
		res.status(401);
		res.json({ message: "Need listid" });
		return;
	}
	User.find({ isConsumer: false }, function(err, users) {
		users.forEach(function(obj, index) {
			var j = new Job({ list: listId, shopper: obj._id });
			j.save();
		});
	});
	res.json({ ok: true });
});

/* GET a job */
router.get('/:job_id', function(req, res) {
	
});



module.exports = router;