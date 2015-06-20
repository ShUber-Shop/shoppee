var mongoose = require('mongoose');
var Schema = mongoose.Schema;

shoppingItemSchema = new Schema({
	name: String,
	priceMin: Float,
	priceMax: Float,
	comments: String,
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
shoppingItemSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// change the updatedAt field to current date
	this.updatedAt = currentDate;

	// if createdAt doesn't exist, add to that field
	if (!this.createdAt)
	this.createdAt = currentDate;

	next();
});

var ShoppingItem = mongoose.model('ShoppingItem', shoppingItemSchema);

module.exports = ShoppingItem;