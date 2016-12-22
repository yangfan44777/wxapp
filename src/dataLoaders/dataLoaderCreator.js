import DataLoader from 'dataloader';
import cache from '../cacheModule/main.js';

function createDataLoader(mongooseExecPromise) {
	/* 缓存策略： */
	/* 1. 尝试从cache中读取所有key对应的value
	   2. 有缓存数据就push到缓存数组，没有就push到待查询DB数组 
	   3. 判断needLoadFromDBList是否有元素, 如果有, 则读取数据库, 数据返回后与缓存队列合并
	   4. 如果没有, 直接返回缓存队列 
	   5. cacheDB 如果挂掉, 直接穿透到DB查询所有数据*/

    /*
     *
     */
	/* 尝试从缓存中获取数据
     * @param {Array<String>} keys 待查找keys
     * @return {Promise<Object>} 待查询DB的key队列needLoadFromDBList和缓存数据队列cachedList
	 */
	let getValsFromCache = keys => cache.get(keys).then((res)=>{
			let needLoadFromDBList = [];
			let cachedList = [];
			console.log('从cache中拿到:',res);
			//找出所有为null的value, 打到DB查询, 查询后加入缓存
			res.forEach((val, idx) => {
				if (val === null) {
					needLoadFromDBList.push(keys[idx]);
				} else {
					cachedList.push(val);
				}
			});
			
			return {
				needLoadFromDBList,
				cachedList
			};
		});

	/* 获取所有数据 (该函数作为then回调)
	 * @param {Object} res 待查询key队列和缓存数据队列
	 * @return {Array} 返回填充好的两组队列
	 */
	let getAllVals = res => res.needLoadFromDBList.length > 0 ? 
				Promise.all([
					mongooseExecPromise(res.needLoadFromDBList),
					//commondityModel._model.find().where('_id').in(res.needLoadFromDBList).lean().exec(),
					Promise.resolve(res.cachedList)
				]) : [[], res.cachedList];

	/* 合并两个队列(该函数作为then回调), 同时写入未被缓存的内容到cacheDB
     * @res {Object} getAllVals返回的resolve数据[needLoadFromDBList, cachedList]
     * @return 合并后的数据
	 */
	let mergeVals = res => {
		//res[0]：从DB中读取的数据
		//res[1]: 从cache中读取的数据
		//res[0]缓存到cache中
		cache.set(
			//使用ObjectId作为key
			res[0].map(item=>item._id.toString()),
			res[0].map(item=>JSON.stringify(item))
		);
		
		//缓存中的每一个值都转换成js对象
		res[1] = res[1].map(val => JSON.parse(val));

		//合并
		return [...res[0], ...res[1]];
	};

	/* 需要保证最后返回的数组元素的顺序和最开始传进来的顺序是一致的, 原因是因为dataLoader的实现依赖这个顺序
     * see: https://github.com/facebook/dataloader/blob/master/src/index.js#L284-L291
	 * (该函数作为then回调)
	 *
	 * @param {Array<String>} ObjectId数组
	 * @param {Array<Object>} vals 查找到的所有数据(顺序一般是打乱的)
	 * return {Array<Object>} 排序后的数组
	 */
	let ensureValsOrder = (keys) => (vals) => {
		
		var length = keys.length;
		let _vals = [];
		while (length--) {
			_vals[length] = null;
		}
		
		vals.forEach((val, idx) => {
			let _idx = keys.indexOf('' + val._id);
			if (_idx > -1) {
				_vals[_idx] = val;
			}
		});
		return _vals;

	};

	let batch = keys => getValsFromCache(keys)
		.then(getAllVals)
		.then(mergeVals)
		.then(ensureValsOrder(keys));

	return new DataLoader(batch, {cache: false});

}

export default {create: createDataLoader}