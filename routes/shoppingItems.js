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


// no root route, covered in shoppingLIsts.js


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

  var newItem = {
    name: req.body.name,
    priceMin: parseInt(req.body.priceMin),
    priceMax: parseInt(req.body.priceMax)
  };

  // validation
  if(!newItem.name){
    var err = 'You must specify a name'
  }else if (!(newItem.priceMin >= 0)) {
    var err = 'You must specify a min price that is 0 or greater'
  }else if (!(newItem.priceMax >= newItem.priceMin)) {
    var err = 'You must specify a max price that is greater than minPrice'
  };

  if(err){
    console.log('err', err);
    res.status(401);
    res.json(err);
    return;
  }

  // validation complete
  console.log('the new item is', newItem);
  console.log('the parent is', req.parentList)
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

