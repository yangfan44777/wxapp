var express = require( 'express' );
var PhoneCode = require('../models/phoneCodeModel.js');
var router = express.Router();

var TopClient = require('../third_libs/alidayu/topClient').TopClient;

let APPKEY = '23427982';
let APPSECRET = '430ee560b133223895cb1d58a617ca40';
let REST_URL = 'http://gw.api.taobao.com/router/rest';
let SMS_TEMPLATE_CODE = 'SMS_13010789';
let SMS_FREE_SIGN_NAME = 'wxapp';
let SMS_TYPE = 'normal';

var client = new TopClient({
    'appkey': APPKEY,
    'appsecret': APPSECRET,
    'REST_URL': REST_URL
});

router.post('/', async (req, res) => {

    var phone = req.body.phone;
    var openid = req.body.openid;
    /* 六个 0 - 9 随机数*/
    var code = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10)
    ].join('');

    client.execute('alibaba.aliqin.fc.sms.num.send', {
        'sms_type': SMS_TYPE,
        'sms_free_sign_name': SMS_FREE_SIGN_NAME,
        'sms_param':'{\"code\":\"' + code + '\",\"product\":\"[wxapp]\"}',
        'rec_num': phone,
        'sms_template_code': SMS_TEMPLATE_CODE
    }, async function(error, response) {
        if (!error) {
            var phoneCode = new PhoneCode({
                openid: openid,
                phone: phone,
                code: code,
                expire: + new Date() + 300000 //5分钟有效
            });
            try {
                await phoneCode.save();
                res.json({err: 0, data:{success: true}});
            } catch (err) {
                res.json({err: 1, msg: '保存phoneCode失败'});
            }
        } else {
            console.log(error);
            res.json({err: 2, msg: '验证码发送失败'});
        }
    });
});
module.exports = router;
