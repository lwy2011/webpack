const path = require("path");
const webpack = require('webpack')
module.exports = {
    entry: {react: ['react','react-dom']}, //打包模块
    output: {
        filename: "_dll_[name].js",   //拼接name
        path: path.resolve(__dirname, "./dist"),
        library: '_dll_[name]', // 一致性,值就是文件的导出数据值
    },
    mode: "development",
    plugins: [
        new webpack.DllPlugin({  //建立字典
            name : '_dll_[name]',
            path : path.resolve(__dirname,'dist','manifest.json')
        })
    ]
};