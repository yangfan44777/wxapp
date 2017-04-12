import config from '../config.js';
const uuidV1 = require('uuid/v1');

let mockR  = config.mockR;

export function create (data) {
	let session3rd = uuidV1();

	data.expire = new Date() + 3000000 //50分钟有效

	/*暂时存到内存中*/
	mockR[session3rd] = data;

	return session3rd;
}

export function isValidSession (sessionkey) {
	let session = config.mockR[sessionkey]
	return session 
		&& session.expire >= +new Date();
}