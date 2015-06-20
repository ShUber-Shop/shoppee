var mongoose = require('mongoose');
var Schema = mongoose.Schema;

jobSchema = new Schema({
	list: { type: mongoose.Schema.ObjectId, ref: 'ShoppingList' },
	shopper: { type: mongoose.Schema.ObjectId, ref: 'User' },
	done: Boolean,
	createdAt: Date,
	updatedAt: Date,
	offer: Number,
	accepted: Boolean
});

// on every save, add the date
jobSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// change the updatedAt field to current date
	this.updatedAt = currentDate;

	// if createdAt doesn't exist, add to that field
	if (!this.createdAt)
	this.createdAt = currentDate;

	next();
});

var Job = mongoose.model('Job', jobSchema);

module.exports = Job;