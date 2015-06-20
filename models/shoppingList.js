var mongoose = require('mongoose');
var Schema = mongoose.Schema;

shoppingListSchema = new Schema({
	name: String,
	items: [{ type: mongoose.Schema.ObjectId, ref: 'ShoppingItem' }],
	looking: Boolean,
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
shoppingListSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// change the updated_at field to current date
	this.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!this.created_at)
	this.created_at = currentDate;

	next();
});

var ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;