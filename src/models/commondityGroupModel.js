import mongoose from 'mongoose';
import config from '../config.js';

let Schema = mongoose.Schema;

let commondityGroupSchema = new Schema({

	//商品组id
	id: Schema.Types.ObjectId,

	//商品组名
	name: {type: String, default: '商品名称'},

	//价格
	price: {type: Number, default: 0.00},

	//缩略图
	pic: {type: String, default: config.defaultPic},

	//详情图数组
	detail_pics: {type: [String], default: ['pic1.png','pic2.png']},

    //商品类型
    type: [String],

    //评论id数组
    comments_id: [String],

    //型号id数组
    sku: [String]
});


var _CommondityGroupModel = mongoose.model('CommondityGroup', commondityGroupSchema);

let create = function (commondityGroupData) {
	var commondityGroup = new _CommondityGroupModel(commondityGroupData);
	return commondityGroup.save();
};

var createMongooseExecFn = function (nativeFn) {
	return function () {
		(nativeFn.apply(_CommondityGroupModel, arguments)).exec();
	}
}

let CommondityGroupModel = {
	_model: _CommondityGroupModel,
	updateById: createMongooseExecFn(_CommondityGroupModel.findByIdAndUpdate),
	create: create,
	findById: createMongooseExecFn(_CommondityGroupModel.findById),
	find: createMongooseExecFn(_CommondityGroupModel.find)
};

export default CommondityGroupModel;