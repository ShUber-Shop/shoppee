var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Session = require('../models/session');

/* POST log the user in */
router.post('/signin', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if(!email || !password) {
        res.status(401);
        res.send(JSON.stringify({ auth: false, message: 'You must provide both an email and password in the body of the request' }));
        return;
    }
    User.findOne({ email: email }, 'email', function(err, user) {
        if (err) {
            console.log("error");
            console.error(err);
            res.send(err);
        } else {
            if(!user) {
                // The user could not be found
				res.status(401);
				res.send(JSON.stringify({ auth: false, message: 'The email provided is invalid. The user could not be found' }));
				return;
            } else {
                //log in an existing user
                user.authenticate(email, password, function(err, session){
                    if (err) {
                        console.error(err);
                        res.send(err);
                    } else {
                        if (!session){
                            // The user is unauthorized
                            res.status(401);
                            res.send(JSON.stringify({ auth: false, message: 'The password provided is incorrect' }));
                        } else {
                            // Authentication Succeeded
                            res.setHeader('Content-Type', 'application/json');
                            var authObj = { auth: true, session: session._id };
                            res.send(JSON.stringify(authObj));
                        }
                    }
                });
            }
        }
    });
});

/* POST signup a user */
router.post('/signup', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var mail = req.body.mail;
	var isConsumer = true;
    if(!email || !password) {
        res.status(401);
        res.send(JSON.stringify({ auth: false, message: 'You must provide both an email and password in the body of the request' }));
        return;
    }
    User.findOne({ email: email }, 'email', function(err, user) {
        if (err) {
            console.log("error");
            console.error(err);
            res.send(err);
        } else {
            if(!user) {
				res.status(200);
				var newUser = new User({ email: email, password: password, firstName: firstName, lastName: lastName, mail: mail, isConsumer: isConsumer });
				newUser.save();
				newUser.authenticate(email, password, function(err, session){
                    if (err) {
                        console.error(err);
                        res.send(err);
                    } else {
                        if (!session){
                            // The user is unauthorized
                            res.status(401);
                            res.send(JSON.stringify({ auth: false }));
                        } else {
                            // Authentication Succeeded
                            // Save the user, since we know he's legit
                            newUser.save();
                            res.setHeader('Content-Type', 'application/json');
                            var authObj = { auth: true, session: session._id };
                            res.send(JSON.stringify(authObj));
                        }
                    }
                });
				res.json(u);
				return;
            } else {
                // a user with that email already exists
				res.status(401);
				res.json({ auth: false, message: 'A user with that email already exists' })
            }
        }
    });
});

/* GET a user's info */
router.get('/:user_id', function(req, res, next) {
	User.findById(req.params.user_id, function(err, user) {
		if(user) {
			res.json(user);
		} else {
			res.json({ message: 'The user could not be found' });
		}
	});
});

module.exports = router;