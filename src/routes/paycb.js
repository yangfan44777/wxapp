var express = require('express');
var router = express.Router();
var request = require('request');


router.post('/', function(req, res, next) {
	console.log(req.query);
	return res.json(req.query);
});

module.exports = router;
