var express = require('express');
var router = express.Router();
var ShoppingList = require('../models/shoppingList');

var clientListFields = 'name shopper consumer looking items createdAt updatedAt'

// return all lists, unordered
router.get('/', function(req, res, next) {
  ShoppingList.find({}, clientListFields ,function(err, lists){
    if (err) {
        console.log("error");
        console.error(err);
        res.send(err);
        return;
    };
    res.json({lists:lists});
  });
});

// return a single list
router.get('/:list_id', function(req, res, next) {

  var listId = req.params.list_id;

  if(!listId){
    var errorMsg = "No list ID provided"
    console.log('error', error);
    res.status(401);
    res.json({message: errorMsg})
    return;
  };

  ShoppingList.findOne({_id: listId}, clientListFields ,function(err, list){
    if (err) {
        console.log("error");
        console.error(err);
        res.send(err);
        return;
    };

    res.json(list);

  });
});


// Create a new list

router.post('/', function(req, res, next) {

  // validate by checking if name exists

  if(!req.body.name){
    res.status(401);
    res.json({message: 'You must provide a list name' });
    return;
  };

  // create a the new list
  var newList = new ShoppingList({
    name: req.body.name,
    consumer: req.currentUser._id,
    items: [],
  })

  // save that list
  newList.save();

  // return the list
  res.json(newList);

})


module.exports = router;