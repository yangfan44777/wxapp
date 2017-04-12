import mongoose from 'mongoose';
import config from '../config.js';

let Schema = mongoose.Schema;

let userSchema = new Schema({

	//用户id
	id: Schema.Types.ObjectId,

	//openid
	user_id: {type: String},

	//姓名
	name: {type: String},

	//手机号
	phone: {type: String},

	//邮编
	postcode: {type: String},

	//地址
	location: [String],

	//详细地址
	address: [String],

	//订单
	orders: [String]
});


let _UserModel = mongoose.model('User', userSchema);

let create = function (userData) {
	let user = new _UserModel(userData);
	return user.save();
};

let createMongooseExecFn = function (nativeFn) {
	return function () {
		return (nativeFn.apply(_UserModel, arguments)).exec();
	}
}

let UserModel = {
	_model: _UserModel,
	updateById: createMongooseExecFn(_UserModel.findByIdAndUpdate),
	create: create,
	findById: createMongooseExecFn(_UserModel.findById),
	find: createMongooseExecFn(_UserModel.find),
	findOneAndUpdate: createMongooseExecFn(_UserModel.findOneAndUpdate),
	findOne: createMongooseExecFn(_UserModel.findOne),
	update: createMongooseExecFn(_UserModel.update)
};

export default UserModel;