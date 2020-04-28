require("./index.css");
// import $ from 'jquery'
//require("expose-loader?$!jquery");  //全局暴露jquery
require("../0配置");
// require('jquery')
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
    console.log("p",88);
}));

console.log("dsdf".includes("f"));

console.log($,555,window.$);
