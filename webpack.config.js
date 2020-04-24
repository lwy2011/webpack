const path = require("path");
module.exports = {
    entry: "./src/index.js",//入口
    output: {
        filename: "bundle.js",  //文件名
        path: path.resolve(__dirname, "./dist")  //路径绝对路径
    },
    mode:'development', //生产模式，开发模式 production
};