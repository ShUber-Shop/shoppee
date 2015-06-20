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

	// change the updatedAt field to current date
	this.updatedAt = currentDate;

	// if createdAt doesn't exist, add to that field
	if (!this.createdAt)
	this.createdAt = currentDate;

	next();
});

var ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;