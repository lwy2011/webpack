require("./index.css");
// import $ from 'jquery'
//require("expose-loader?$!jquery");  //全局暴露jquery
require("../0配置");
// require('jquery')

import logo from "./my.png";   //图片处理中，导入的实质是生成了一个带hash的图片地址


console.log("入口文件打包！出口文件生成");
const a = () => {
    console.log(88);
};
a();
const log = A => {
    console.log(A, 999);
};

@log
class S {
    constructor() {
        this.x = 2;
    }
}

const s = new S();
console.log(s);
const x = async () => {
    await console.log("装饰器");
};
x();

function* y() {
    yield 1;
}

console.log(y().next());
new Promise((resolve => {
    console.log("p", 88);
}));

console.log("dsdf".includes("f"));

console.log($, 555, window.$);


//图片处理：需要file-loader
const img = new Image();
console.log(logo, "logo src");
img.src = logo;
document.body.appendChild(img);

// console.lo("test source map");  source map test

const xml = new XMLHttpRequest();
xml.open("GET", "/api/user", true);
//这里访问的是当前webpack-dev-server的端口，webpack的server监听，然后转发！
//http-proxy设置
xml.onload = () => {
    console.log(xml.response, "跨域测试！！");
};
xml.send();

//import "bootstrap";  //test resolve 配置，设置默认查找路径
// 报错，./node_modules/bootstrap/dist/js/bootstrap.js。不是css文件！！！

//import 'bootstrap/dist/css/bootstrap.css'  //如此才对！！但是太麻烦了，用到alias字段了！
import "bootstrap";  //配置了alias之后，可以方便导入了！


import "./b";  //省略css文件后缀，如何配置resolve，extensions 扩展名


//定义环境变量 ：

const url = MODE === "dev" ? "localhost:3000" : "http://baidu.com";
console.log(url, 888, "环境变量测试", xyz);


//优化  ：

//react 导入测试：

import React from "react";

console.log(React);


//手动引入包的一些依赖，强制所有的默认引入忽略，进行包的体积优化！，moment为例

//moment有多重语言支持的语言包，默认全加载各国语言！！太大了！
//默认require的加载忽略掉，然后手动导入自己的所需！这是思路！
import moment from "moment";

// import 'moment/locale/zh-cn'
moment.locale("zh-cn");
//坑！！我试了下，盲猜moment做了优化了，默认只导入英语，或者指定的语言！
// 害我试了好久，发现怎么操作，匹配都是打包无明显变化！
// 通过不设置忽略加载，我这里做了语言选择，发现一直都是英语而不是中文，这里也可以有些猜疑了！！这案例要更新了！！
console.log(moment().endOf("day").fromNow(), "moment 按需加载依赖！！test");

//动态链接库


import {render} from "react-dom";

console.log(render);
const dom = <h1>jsx 动态链接库的test！</h1>;
render(
    dom, document.body.querySelector("div")
);

//多页面打包，抽离公共代码，抽离第三方公共依赖！
import "./a";
import "./b";
import "jquery";

//懒加载：

const div = document.createElement("div");
div.innerText = "懒加载文件";
document.body.appendChild(div);
div.addEventListener("click", () => {
    alert("clicked!");
    //es6草案的语法，jsonp实现动态加载文件！！
    import("./lazy-loading").then(
        data => {
            console.log(data);
        }
    );
});