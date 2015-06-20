var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// We use the Mongo _id as the token
var sessionSchema = new Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  expires_at: Date,
  createdAt: Date,
  updatedAt: Date
});

sessionSchema.pre('save', function(next) {
  var currentDate = new Date();
  
  this.updatedAt = currentDate;

  if (!this.createdAt) {
    var daysThatSessionWillLast = 3;
    var expirationDate = new Date();
    expirationDate.setDate(currentDate.getDate + daysThatSessionWillLast);
    this.expires_at = expirationDate;
    this.createdAt = currentDate;
  }

  next();
});

sessionSchema.methods.isValid = function checkValidity(){
    if(this.expires_at < new Date()){
        return false;
    } else {
        return true;
    }
};

var Session = mongoose.model('Session', sessionSchema);

module.exports = Session;