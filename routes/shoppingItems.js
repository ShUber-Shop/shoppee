var express = require('express');
var router = express.Router({mergeParams:true});

var ShoppingList = require('../models/shoppingList');
var ShoppingItem = require('../models/shoppingItem');

var clientListFields = 'name shopper consumer looking items createdAt updatedAt'

// ensure the parent list exists for all subroutes

router.all('*', function(req,res,next){
  var listId = req.params.list_id;

  if(!listId){
    var errorMsg = "No list ID provided";
    console.log('error', error);
    res.status(401);
    res.json({message: errorMsg});
    return;
  };

  ShoppingList.findOne({_id: listId}, clientListFields ,function(err, list){
    if (err) {
        console.log("error");
        console.error(err);
        res.send(err);
        return;
    };
    // attach parentList list to all routes
    req['parentList'] = list;
    console.log('parent list is', list);
    next();
  });
});


router.get('/', function(req, res) {
	ShoppingList.findById(req.params.list_id).populate('items').exec(function(err, list) {
		if (err) {
			console.log("error");
			console.error(err);
			res.send(err);
			return;
    	} else {
			res.json({ items: list.items })
		}
	});
});


// return a single item
router.get('/:item_id', function(req,res){
  var itemId = req.params.item_id;
  if(!itemId) {
    var errMsg = 'Item ID does not exist';
    console.log('err', errMsg);
    return;
  };

  ShoppingItem.findOne({_id:itemId}, function(err, item){
    if(err){
      console.log(err);
      res.json({message:err});
    };
    res.json(item);
  });
});

// add an item
router.post('/', function(req,res){

  var newItem = new ShoppingItem({
    name: req.body.name,
    notes: req.body.notes
  });

  // validation
  if(!newItem.name){
    var err = 'You must specify a name'
	console.log('err', err);
    res.status(401);
    res.json(err);
    return;
  }

  newItem.save();
  req.parentList.items.push(newItem);
  req.parentList.save();
  // res.json({})

});

module.exports = router;


// # items

// - Add an item to a list
// [POST]/api/v1/lists/:list_id/items

// x View an item in the list
// [GET]/api/v1/lists/:list_id/items/:item_id

// - Remove an item
// [DELETE]/api/v1/lists/:list_id/items/:item_id

// - Update an item
// [PUT]/api/v1/lists/:list_id/items/:item_id

