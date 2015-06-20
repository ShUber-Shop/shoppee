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

	// change the updated_at field to current date
	this.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!this.created_at)
	this.created_at = currentDate;

	next();
});

var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;