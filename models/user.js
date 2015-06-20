var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Session = require("./session");

userSchema = new Schema({
	firstName: String,
	lastName: String,
	mail: String,
	email: String,
	isConsumer: Boolean,
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

  // change the updatedAt field to current date
  this.updatedAt = currentDate;

  // if createdAt doesn't exist, add to that field
  if (!this.createdAt)
  this.createdAt = currentDate;

	next();
});

userSchema.methods.authenticate = function authUser(email, password, callback) {
    var session = new Session({ user: this });
    session.save();
    callback(null, session);
};

userSchema.methods.isLoggedIn = function checkLoggedIn(){
    // TODO: Check that the user is logged in
    return true;
}

var User = mongoose.model('User', userSchema);

module.exports = User;