let express = require('express');
let router = express.Router();
let request = require('request');
import config from '../config.js';
import session from '../session/main.js';
import {getOpenidAndSessionkeyByCode} from '../utils.js'

let mockR = config.mockR;

router.get('/', (req, res, next) => {

	/* 微信登录获取的code */
	let code = req.query.code;

	getOpenidAndSessionkeyByCode(code, (err, data) => {
		if (err) {
			console.log(err);
			res.json({
      			err: 'LOGIN_FAIL',
      			msg: '登录失败'
      		});
		} else {
			//创建server的session
			let session3rd = session.create({
      			openid: data.openid,
      			wxsessionkey: data.wxsessionkey
      		});
			res.json({
				err: null, 
				data: {sessionkey: session3rd}
			});
		}
	});
});

module.exports = router;