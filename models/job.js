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

	// change the updated_at field to current date
	this.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!this.created_at)
	this.created_at = currentDate;

	next();
});

var Job = mongoose.model('Job', jobSchema);

module.exports = Job;