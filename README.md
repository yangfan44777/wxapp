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
