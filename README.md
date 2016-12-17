## 1.安装依赖
`npm install`

## 2.修改数据库配置
    //src/config.js
    export default {
      db: {
          host: '127.0.0.1', //mongodb IP
          port: '27017', //mongodb PORT
          name: 'wxapp' //数据库名
      },
      defaultPic: ''
    }
    
## 2.编译
`gulp`

## 运行
    npm run start
    
    //浏览器输入地址:
    http://127.0.0.1:3000
