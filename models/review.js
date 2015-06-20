var mongoose = require('mongoose');
var Schema = mongoose.Schema;

reviewSchema = new Schema({
	by: { type: mongoose.Schema.ObjectId, ref: 'User' },
	for: { type: mongoose.Schema.ObjectId, ref: 'User' },
	rating: Integer,
	comment: String,
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
reviewSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// change the updatedAt field to current date
	this.updatedAt = currentDate;

	// if createdAt doesn't exist, add to that field
	if (!this.createdAt)
	this.createdAt = currentDate;

	next();
});

var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;