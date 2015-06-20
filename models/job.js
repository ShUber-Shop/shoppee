var mongoose = require('mongoose');
var Schema = mongoose.Schema;

jobSchema = new Schema({
	list: { type: mongoose.Schema.ObjectId, ref: 'ShoppingList' },
	address: String,
	expenseLinks: [String],
	done: Boolean,
	total: Float,
	createdAt: Date,
	updatedAt: Date
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