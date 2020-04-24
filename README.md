# webpack
study webpack

 ## 安装 webpack 
 - webpack   webpack-cli 

## 0配置，打包
输出js闭包模块！
找 webpack 命令 ，node_modules目录下的bin，执行！
commonJS 的语法！模块化，导致打包后的结果会是闭包函数！
`webpack 0配置.js` 
默认输出当前文件所在目录下的 /dist/main.js

- 模块化机制打包成浏览器可执行！
- 多个文件打包成一个压缩文件！

## 手动配置

- 默认配置文件： webpack.config.js
node 写的,node写法commonJS规范！

- 入口，出口
entry：相对路径。
output = [filename,path:绝对路径]。
- mode 模式
production , development

- 分析打包后的文件

`((modules)=>{  
//定义一个缓存，以后拿模块就省事了。
//实现了commonJS 规范方法
//调用CommonJS方法，找入口文件进行操作：
//在不在缓存中？ 不在？缓存中注册，缓存为字典，帮助存储，读取！
//重要的是递归缓存各个二级三级多级依赖的逻辑！key值用的文件的路径代替的。
})`

- 自定义配置文件

`scripts 内 ：yarn webpack --config filename`

