var express = require('express');
var router = express.Router();
var session = require('../session/main.js');

const AUTH_FAIL = 'AUTH_FAIL';

//所有请求过来之后:
/*
	1. 检查是否有session3rd, 如果没有session3rd, 返回需要登录
	   如果有session3rd, 但非法(过期), 返回需要登录
	2. 前端调用wx.login()获取code
	3. 发送code给server
	4. server用code获取openid、sessionkey等信息, 同时生成过期时间.打包这些值并保存成session3rd的值
	5. 把生成的session3rd返回给前端
	6. 前端存储在storage里, 同时发送前一次的请求（此次带上session3rd）
	7. server验证session3rd，如果合法, 证明用户已经登录了, 即可通过session3rd获取当前用户的各种信息
*/
//整个登录过程微信用户应该是无感知的

router.all('*', (req, res, next) => {

	var sessionkey = req.query.sk;

	if (session.isValidSession(sessionkey)) {
		/* 继续下面的操作 */
		next(req, res);
	} else {
		/*前端收到{err: 'AUTH_FAIL'}后, 需要调用登录接口*/
		res.json({
			err: AUTH_FAIL
		});
	}
});

module.exports = router;