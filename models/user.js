var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

	// change the updated_at field to current date
	this.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!this.created_at)
	this.created_at = currentDate;

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