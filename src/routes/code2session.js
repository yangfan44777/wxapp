var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/', function(req, res, next) {

	let code = req.query.code;
	request(`https://api.weixin.qq.com/sns/jscode2session?appid=wxc2c69d984b94586a&secret=2a7785b4db349fd075fec7961e0e8a51&js_code=${code}&grant_type=authorization_code`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(body);
      } else {
      	res.json(error);
      }
    })
});

module.exports = router;
