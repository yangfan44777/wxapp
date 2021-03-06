var express = require('express');
var router = express.Router();
var request = require('request');
var wxPayment = require('wx-payment');
import config from '../config.js';
var fs = require('fs');

const SECRET = '2a7785b4db349fd075fec7961e0e8a51';
const APPID = 'wxc2c69d984b94586a';
const MCHID = '1414330502';
const APIKEY = 'wP5hjEtXT1cHvPS3WdMMNoczB03EG0jY';

/* 初始化微信pay */
wxPayment.init({
	appid: APPID,
	mch_id: MCHID,
	apiKey: APIKEY, //微信商户平台API密钥
	pfx: fs.readFileSync(config.rootDir + '/apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
});
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

router.post('/', function(req, res, next) {

	let query = req.query;

	let code = query.code;

	let remoteAddress = getClientIp(req);

	/* 获取openid封装成工具 */
	request(`https://api.weixin.qq.com/sns/jscode2session?appid=wxc2c69d984b94586a&secret=2a7785b4db349fd075fec7961e0e8a51&js_code=${code}&grant_type=authorization_code`, function (error, response, body) {
      	if (!error && response.statusCode == 200) {
	      	let openid = JSON.parse(body).openid;

	      	let pa = {
			  	body: '支付测试', // 商品或支付单简要描述
			  	out_trade_no: +new Date() + '', // 商户系统内部的订单号,32个字符内、可包含字母
			  	total_fee: 1, //订单总金额，单位为分
			  	spbill_create_ip: remoteAddress, //APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP
			  	//notify_url: encodeURIComponent('https://petadore.cn/paycb'),
			  	notify_url: 'https://petadore.cn/paycb',
			  	trade_type: 'JSAPI',
			  	product_id: '1234567890',
			  	openid: openid
			};

	      	wxPayment.getBrandWCPayRequestParams(pa, (err, reqparam) => {
			  	res.json(reqparam);
			});
      	} else {
      		res.json(error);
      	}
    })
});


module.exports = router;
