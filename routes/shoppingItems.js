var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


// # items

// - Add an item to a list
// [POST]/api/v1/lists/:list_id/items

// - View an item in the list
// [GET]/api/v1/lists/:list_id/items/:item_id

// - Remove an item
// [DELETE]/api/v1/lists/:list_id/items/:item_id

// - Update an item
// [PUT]/api/v1/lists/:list_id/items/:item_id

