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

console.lo("test source map");

console.log(446)