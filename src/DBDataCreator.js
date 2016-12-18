import mongoose from 'mongoose';
import config from './config.js';
import commondityModel from './models/commondityModel.js';
import commondityGroupModel from './models/commondityGroupModel.js';
import 'regenerator-runtime/runtime';

mongoose.connect('mongodb://'+config.db.host+'/' + config.db.name);
function isWindow(obj)     { return obj != null && obj == obj.window }
function isObject(obj)     { return type(obj) == "object" }
function isPlainObject(obj) {
	return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
}
let isArray = Array.isArray || function(object){ return object instanceof Array }
function _extend(target, source, deep) {
for (let key in source)
  if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
    if (isPlainObject(source[key]) && !isPlainObject(target[key]))
      target[key] = {}
    if (isArray(source[key]) && !isArray(target[key]))
      target[key] = []
    _extend(target[key], source[key], deep)
  }
  else if (source[key] !== undefined) target[key] = source[key]
}

let extend = function(target){
	var deep, args = [].slice.call(arguments, 1)
	if (typeof target == 'boolean') {
	  deep = target
	  target = args.shift()
	}
	args.forEach(function(arg){ _extend(target, arg, deep) })
	return target;
};

//{create, update, remove}
let Operation = function (type) {
	let _global_map = Operation._global_map;
	/**
     * 数据库操作构造方法
     * @param {string} name 该对象名称, 建议用collection名。如果创建多个对象可以加后缀区分, 例如:commondity_1
     * @param {Function} mongoexec 返回promise对象的mongoose API.
     * @param {Object} defaultData 待插入或修改数据的默认值
	 */
	let con = function (name, mongoexec, defaultData) {
		_global_map[type + '|' + name] = this;
		this.type = type;
		this.name = name;
		this.defaultData = defaultData || {};
		this.mongoexec = mongoexec;

	};
	con.prototype.exec = async function (data) {
		data = extend(this.defaultData, data || {});
		if (type === 'create') {
			let timeStamp = '_' + (+new Date());
			for (let i in data) {
				if (typeof data[i] === 'string') {
					data[i] += timeStamp;
				}
			}
		}
		let msg = '\n' + this.type + ' ' + this.name + ' ';

		try {
			/* 如果是update或者remove，这里需要处理 */
			let ret = await this.mongoexec(data);
			console.log(msg + 'success:\n' + JSON.stringify(ret));
		} catch (e) {
			console.log(msg + 'fail:\n' + e.toString());
		}
		process.exit();
	}
	return con;
};
Operation._global_map = {};
Operation._get = (key) => Operation._global_map[key];

/* 对应process 参数中的operation */
let Create = Operation('create');
let Update = Operation('update');
let Remove = Operation('remove');
/**
commondity {
    id, //商品id
    name, //商品名
    desc, //描述
    price, //价格
    pic, //缩略图
    comments_id, //评论id
    type, //商品分类
    state, //商品状态(预售、已售罄、已下架、在售)
    count_rest, //剩余商品数
    count_sold //已售数量
    bought_by //被哪些用户购买的用户数组, 原子操作 see: http://www.yiibai.com/mongodb/mongodb_atomic_operations.html
}
*/
let create_commondity = new Create(
	/* 对应process 参数中的collection */
	'commondity',
	commondityModel.create,
	{
		title: '商品型号名',
		price: 10.00,
		pic: '',
		detail_pics: [],
		state: 1,
		count_rest: parseInt(Math.random() * 1000, 10),
		count_sold: parseInt(Math.random() * 1000, 10)
	}
);

let create_commondityGroup = new Create(
	/* 对应process 参数中的collection */
	'commondityGroup',
	commondityGroupModel.create,
	{
		name: '商品型号名',
		price: 10.00,
		pic: '',
		detail_pics: [],
		type: [],
		comments_id: [],
		sku: []
	}
);

let args = process.argv.splice(2);
let operation = args[0];
let collection = args[1];
/* 控制台输入时使用单引号包住整个数据部分, 数据部分用双引号, 没有给定的字段按上面的默认值, 没有data参数完全按默认值插入 */
/* 例如插入一条商品: node DBDataCreator.js create commondity '{"name":"卡地亚鹿晗同款手镯", "count_sold":901}'*/
let data = args[2] || '{}';

if (Operation._get(operation + '|' + collection)) {

	Operation._get(operation + '|' + collection).exec(JSON.parse(data));
}
//
