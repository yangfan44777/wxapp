var express = require('express');
var router = express.Router();
var request = require('request');


/*router.post('/', function(req, res, next) {
	console.log(req.query);
	return res.json(req.query);
});*/

router.post('/', wxPayment.wxCallback(function(msg, req, res, next){
  // 处理商户业务逻辑
  console.log(msg);
  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
  res.success();
}));

module.exports = router;
