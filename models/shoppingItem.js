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

	// change the updated_at field to current date
	this.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!this.created_at)
	this.created_at = currentDate;

	next();
});

var ShoppingItem = mongoose.model('ShoppingItem', shoppingItemSchema);

module.exports = ShoppingItem;