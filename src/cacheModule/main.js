import redis from 'redis';
import bluebird from 'bluebird';
import config from '../config.js';

const READY = 'ready', FAIL = 'fail', CONNECT = 'connect';

//see: https://github.com/NodeRedis/node_redis#promises
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//clien状态
let status = null;

//client实例
let client = redis.createClient(config.cacheDB.RDS_PORT, config.cacheDB.RDS_HOST, config.cacheDB.RDS_OPTS);

client.on('ready', (res) => {
	status = READY;
	console.log('redis',READY);
});

client.on('connect', (res) => {
	status = CONNECT;
	console.log('redis',CONNECT);
});

client.on('error', function (err) {
	status = FAIL;
    console.log(err);
});

/**
 * 尝试从缓存中读取数据
 * @param {Array<string>} keys 缓存内容对应key数组
 * @return {Promise<Array<String>>} 返回所有key的缓存值
 *
 */
let get = function (keys) {
	/* 如果cacheDB出现错误, 返回null数组 */
	if (status !== 'ready') {
		return Promise.resolve(keys.map(()=>null));
	}
	return client.multi([['mget', ...keys]])
	.execAsync()
	.catch((err) => {
		return Promise.resolve([keys.map(()=>null)]);
	})
	.then(res => {
		return res[0];
	});
};

/**
 * 设置缓存到cacheDB
 * @param {Array<string>} keys 缓存key数组
 * @param {Array<string>} vals 缓存内容数组
 *
 */
let set = function (keys, vals) {
	if (status !== 'ready') {
		//throw new Error(`redisss status is "${status}"`);
		return;
	}
	/* 一次性写入, 减少请求cacheDB的次数 */
	client.multi(keys.map((key, idx) => ['set', key, vals[idx]]))
	.execAsync();
};

let del = function (key) {
	client.del(key);
};

export default {get, set, del};