let request = require('request');

/* 根据code获取openid和sessionkey */
export function getOpenidAndSessionkeyByCode (code, callback) {

	let ERROR_MSG_PRE = 'function getOpenidAndSessionkeyByCode ';

	if (!code) {
		callback({err: ERROR_MSG_PRE + 'require a code.'}, null);
	}

	request(`https://api.weixin.qq.com/sns/jscode2session?appid=wxc2c69d984b94586a&secret=2a7785b4db349fd075fec7961e0e8a51&js_code=${code}&grant_type=authorization_code`, function (error, response, body) {
      	if (!error && response.statusCode == 200) {
      		let bodyjson = JSON.parse(body);
	      	let openid = bodyjson.openid;
	      	let wxsessionkey = bodyjson.sessionkey;

	      	/* 正确获取openid和sessionkey */
	      	if (openid && sessionkey) {
	      		callback(null, {openid, wxsessionkey});
	      	} else {
	      		callback({err: ERROR_MSG_PRE + body}, null);
	      	}
      	} else {
      		callback({err: ERROR_MSG_PRE + response.statusCode}, null);
      	}
    });
}
