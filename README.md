## 1.安装依赖
`npm install`

## 2.修改数据库配置
    //edit src/config.js
    export default {
        db: {
            host: '127.0.0.1',
            port: '27017',
            name: 'wxapp'
        },
        defaultPic: ''
    }
    
## 3.编译
`gulp`

## 4.运行

    npm run start
    
http://127.0.0.1:3000

## 数据库创建一个商品型号

    cd build
                                            //数据部分不填使用默认值
    node DBDataCreator.js create commondity '{"title":"哈啤 200ml","price":10.00}'

## 数据库创建一个商品组(包含一个或多个商品型号)
    
    cd build
                                                 //数据部分不填使用默认值
    node DBDataCreator.js create commondityGroup '{"name":"哈啤","price":10.00,"sku":["商品型号1的_id字段", "商品型号2的_id字段"]}'
