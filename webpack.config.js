const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: "./src/index.js",//入口
    output: {
        filename: "bundle.[hash:5].js",  //文件名，哈希，避免覆盖，或者缓存问题
        path: path.resolve(__dirname, "./dist")  //路径绝对路径
    },
    mode:'development', //生产模式，开发模式 production
    devServer: {  //开发服务器配置
        port:3000,  //端口
        progress:true,//进度条
        contentBase:'./dist', //打开的目录
        compress:true ,//Gzip压缩
    },
    plugins:[  //插件
        new HtmlWebpackPlugin({
            template: './src/index.html',  //html地址
            filename: 'index.html' ,  //输出文件名
            minify:{  //压缩html
                removeAttributeQuotes:true  , //删除html中的双引号
                collapseWhitespace:true, //折叠空行html
                hash:true   , //缓存问题
            }
        })
    ]
};