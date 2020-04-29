const express = require("express");
const webpack = require("webpack");
const webpackDevMiddle = require("webpack-dev-middleware");

const config = require("../webpack.config");
const webs = webpack(config);
//打包生成当前服务器的host文件！而不是webpack-dev-server的server,无法用before mock了！

const server = express();
server.use(webpackDevMiddle(webs));
server.get("/user", (req, res) => {
    res.send({data: "test 跨域！！"});
});

server.listen(8081, () => {
    console.log("server start!");
});