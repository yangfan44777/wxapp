import mongoose from 'mongoose';
import config from '../config.js';

let Schema = mongoose.Schema;

let commonditySchema = new Schema({

	//商品型号id
	id: Schema.Types.ObjectId,

	//商品型号名
	title: {type: String, default: '型号0'},

	//价格
	price: {type: Number, default: 0.00},

	//缩略图
	pic: {type: String, default: config.defaultPic},

	//详情图数组
	detail_pics: [String],

	//商品状态, 0: 预售, 1: 在售, 2: 已售罄, 3: 已下架
	state: {type: Number, default: 1},

	//剩余商品数
	count_rest: {type: Number, default: 999},

	//已售数量
	count_sold: {type: Number, default: 0},

});


let _CommondityModel = mongoose.model('Commondity', commonditySchema);

let create = function (commondityData) {
	let commondity = new _CommondityModel(commondityData);
	return commondity.save();
};

let createMongooseExecFn = function (nativeFn) {
	return function () {
		(nativeFn.apply(_CommondityModel, arguments)).exec();
	}
}

let CommondityModel = {
	_model: _CommondityModel,
	updateById: createMongooseExecFn(_CommondityModel.findByIdAndUpdate),
	create: create,
	findById: createMongooseExecFn(_CommondityModel.findById),
	find: createMongooseExecFn(_CommondityModel.find)
};

export default CommondityModel;