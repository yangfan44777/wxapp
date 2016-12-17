import DataLoader from 'dataloader';
function createDataLoader(mongooseExecPromise) {
	/* 需要保证find().where('_id').in(ids)是按ids数组的顺序返回结果 */
	let batch = keys => mongooseExecPromise(keys).then((vals) => {
		/* 按照keys顺序排序 */
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
	});

	return new DataLoader(batch);

}

export default {create: createDataLoader}