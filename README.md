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
output = [filename,path:绝对路径，flename[hash:5]文件名哈希化，避免覆盖，缓存也避免出错]。
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


- 内置的server

`yarn add webpack-dev-server` 
添加，精髓是，是内存中的服务数据！而不是实体的文件数据
`yarn webpack-dev-server`
默认运行，到当前项目的根目录，而不是**dist/bundle.js**。需要配置目录。

 - webpack.config.js中，添加devServer配置！命令行加入开发时的命令！
 devServer :
 port 端口
 progress 进度条
 contentBase 打开的目录
 compress Gzip压缩
 
### html

- 如何处理js文件打包后放入指定的html文件：
    
    把js引入到html中！html文件就是模板，js文件是注入模板的内容！
    webpack-html-plugin插件
    
    - webpack.config.js ：
   `  plugins:[
        new WebpackHtmlPlugin({
            template:path地址，
            filename:打包好的html文件名
            minify:压缩 [去双引号，折叠成一行，哈希name]
        })
     ] `

### css

- 如何引入css
      
    因为html是模板，把css插入就好了！
    
    - 首先，如何导入css文件？
    
    不可能是link标签写在html文件了，因为地址错了，打包后的文件名，以及路径都是不可知！
    用node的模块意识，在js文件中导入css文件就可以导入了！
    
    - 导入后，就打包，报错！
    
    `You may need an appropriate loader to handle this file type, 
    currently no loaders are configured to process this file. `
    node原生是js写的，所以天然亲近js文件,在js文件中导入css文件，webpack会知道如何打包？
    
    - 提示：需要对应的加载解析模块来处理css文件！
    
    js文件的解析规则肯定不适合css文件。
    在配置文件中，对module属性进行配置：
    `
    module:{//模块
            rules: [  //规则,匹配文件，处理文件
                {
                    //css-loader 解析css文件引入css文件的，style-loader把css文件数据插入到html中
                    //loader 有顺序的,默认从右向左，从下到上执行！
                    //更多的参数配置写法：{loader:'style-loader',options:{**:**}}
                    test:/\.css$/,use:['style-loader','css-loader'],
                }
            ]
        }
    `
    - 抽离css文件，不插入html，单独放入一个文件
    
    mini-css-extract-plugin 插件！
    plugins中:
    `
          new MiniCssExtractPlugin({  //抽离css单独成一个css文件
                    filename:'main.css'
                })
    `
    molude 中：
    `
         {
            // less , sass stylus node-sass sass-loader ,stylus stylus-loader
            test: /\.s?css$/,
            use: [
                MiniCssExtractPlugin.loader,   //独立成一个css文件
                "css-loader",   //css文件@import css文件
                'sass-loader'  //scss转为css
            ]
         },
    `
    
    - 如何添加后缀，浏览器的各种前缀？
    
    postcss-loader ，autoprefixer 依赖
    
    在处理成css格式的数据后，用postcss-loader处理！配置文件中，module :
    `
         {
            test: /\.s?css$/,
            use: [
                MiniCssExtractPlugin.loader,   //独立成一个css文件
                "css-loader",   //css文件@import css文件
                "postcss-loader",  //加前缀的loader
                'sass-loader'  //scss转为css
            ]
         },
    `
    这时候直接运行，报错：` No PostCSS Config found in: /Users`。
    创建postcss的配置文件：
    `
       module.exports ={
           plugins:[
               require('autoprefixer')({ overrideBrowserslist: ['iOS >= 7', 'Android >= 4.0'] })
           ]
       }
    `
    
    - 压缩打包css文件
    
  optimize-css-assets-webpack-plugin 
  
  配置文件中：
  `
      optimization: {  //优化项
          minimizer: [
              new OptimizeCssAssetsPlugin()，
              //这里需要配置js压缩的配置，否则js不会被压缩的！
          ]
      },
      mode : 'production'   //这里很重要！！
  `
   ### js 
   
   - es6变es5
   
   babel-loader @babel/core @babel/preset-env
     @babel/plugin-proposal-class-properties @babel/plugin-proposal-class-properties  //高级语法帮助映射
  module :
  `
       {  //转es5
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',   //解析js文件数据
              options: {
                  presets: ['@babel/preset-env'],   //映射转化一些高级语法
                  plugins:[
                      ["@babel/plugin-proposal-decorators", { "legacy": true }],//class
                      ["@babel/plugin-proposal-class-properties", { "loose" : true }], //装饰器
                  ]
              }
          }
       }
  `
  - js 语法处理和校验
  
  转译机械转译同一目标，多处出现，多处转译，代码浪费：
  
  @babel/plugin-transform-runtime  
  @babel/runtime  注意！这个是dependencies里的依赖！！！
  
  `   {  //转es5
          test: /\.m?js$/,
          exclude: /node_modules|bower_components)/,  //查找的js文件的范围，还有include:
          include: path.resolve(__dirname, "src"),
          use: {
              loader: "babel-loader",   //解析js文件数据
              options: {
                  presets: ["@babel/preset-env"],   //映射转化一些高级语法
                  plugins: [
                      ["@babel/plugin-proposal-decorators", {"legacy": true}],//class
                      ["@babel/plugin-proposal-class-properties", {"loose": true}], //装饰器
                      //多个引用转译后的代码，会使同一个被转译的目标多次被转译，代码浪费：
                      "@babel/plugin-transform-runtime", //同时还依赖@babel/runtime，生产环境时候，帮着产生补丁的，这是代码本身的依赖，不是 -dev--save
                  ],
              },
          }
      },
  `
  
  - eslint 做语法校验
  
  `
   {
      //校验：eslint
      // 需要 eslint ,eslint-loader ,并去其官网选择对应的设置，下载.eslintrc.json文件做配置！
      //https://eslint.org/demo/
      test: /\.js$/,
      use: {
          loader: "eslint-loader",
          options: {fix: true},//浅显的语法问题，自动修复！
      },
      enforce:'pre'   ,//强制先执行后处理js。
   }
      `
  
   ### 变为全局变量
   
   以jquery为例：
   通常要用：
   `import $ from 'jquery'
`
    我不想写这句引入，就想所有的模块内直接用$!
    
   1. expose-loader 暴露全局变量的loader ,放在**window**上
   
   在入口文件顶层：
   `
   require("expose-loader?libraryName!./file.js");
   // 通过属性名 "libraryName" 暴露 file.js 的 exports 到全局上下文。
   // 在浏览器中，就将可以使用 window.libraryName 访问。
   require("expose-loader?$!jquery"); 
   //注意！！因为后续导入的包可能需要$,所以，先执行它，再引入后续的其他的包！！否则，后续的包拿不到的！   
   或者在配置文件中设置：
   同样需要入口文件顶层优先导入jquery!!! 
   module: {
     rules: [{
             test: require.resolve('jquery'),
             use: [{
                 loader: 'expose-loader',
                 options: 'jQuery'        //多个属性名占位，有几个写几个，window.$,window.jQuery
             },{
                 loader: 'expose-loader',
                 options: '$'
             }]
         }]
   }
   `
   2. webpack.providePlugin 每个模块都注入
   
   哪里都不需要引入，自动有个环境变量存在！这里不是放在window上了！这是个环境变量！！
   
   `  plugins: [  //插件
            new webpack.ProvidePlugin({  //全局各个模块默认注入变量：
                $:'jquery'
            })
        ],`
   
   3. 引入不打包，script标签形式！注意打包的时候，设置externals字段去掉它，因为jquery已经script标签引入了！
   
   防止有人在模块内还导入jquery！导致打包生成的代码量太多！
   
   ` externals: {  //不需要打包的依赖：比如外部用script的全局文件变量
            jquery:'jQuery'
        },
   `
  
  ## 图片
  
  图片打包，先引入图片，引入的值实质是一个hash的图片地址！！
  
  1. js中创建
  
 ` import xx.png from 'xxx'  `
  `  {   
       test:/\.(png|svg|jpg|gif|jpeg)$/,
       use:{
           loader:'file-loader'
       }
   }`
  
  2. css中
  
  很简单，相对定位就可以了！
  
  ` p{
       width:200px;height: 200px;
       background: url('./my.png');
     }`
     
     打包后的css url也是新的hash地址！
  
  3. html 中
    
    因为打包后的图片地址无法确定，所以如何在html中写img的src呢？
    写成相对定位的地址值，然后：
    
    html-withimg-loader 。
   
   ` {   //图片打包，先引入图片，引入的值实质是一个hash的图片地址！！
        test:/\.(png|svg|jpg|gif|jpeg)$/,
        use:{
            loader:'file-loader',
            options:{
                esModule:false    ,  //文档说什么默认是用的es的import 导入文件模块的，
                // 而不是CommonJS ，这里不设置它，就会使得下面处理html的img失效，
                // 我猜html-withimg-loader是commonJS 的结果写的，而es输出的结果成了一个对象了！
            }
        }
    },
    { //处理html中的图片
        test:/\.html$/,
        use:'html-withimg-loader'
    }
   ` 
    **打包**时可优化的点 ：
     
    html img 的src 的值可以是图片地址，增加了图片的请求性能损耗！
    src 还可以是base64位的数据值！文件大小大了大概0.3。
    html的数据量大了，但是请求消耗小了！图片比较小的时候用很好的！适合首页性能优化！
    这时候，用到url-loader了，而不是 file-loader!!!
    url-loader 替换的是file-loader:
    
    一旦文件超出limit，会**自动用file-loader，不用设置file-loader!!但是要下载这个依赖**！！！！

    ` {   //为了小图片，没必要发请求，打包的不是地址，而是图片的base64数据流，作为img的 src！放入js文件中，等待插入！
         test:/\.(png|svg|jpg|gif|jpeg)$/,
         use:{
             loader:'url-loader',   //html-withimg-loader 那边流到这里，只要图片大小很小，就不走file-loader
             options:{
                 limit:200*1024,
                 esModule:false    ,  //文档说什么默认是用的es的import 导入文件模块的，
                 outputPath: "images",  //打包后的文件目录
             }
         }
     },
    `
    
  ## 打包文件到指定目录
  
  
  在各个文件打包的模块内设置它的目录！
  
  - css文件比较特殊：
  
  `         new MiniCssExtractPlugin({  //抽离css单独成一个css文件
               filename: "/css/main.css"    //这里就是路径
           }),
  `
  
  - 图片处理： 
  
  outputPath
  `  {  
       test: /\.(png|svg|jpg|gif|jpeg)$/,
       use: {
           loader: "url-loader",   //html-withimg-loader 那边流到这里，只要图片大小很小，就不走file-loader
           options: {
               limit: 200 * 1024,
               esModule: false,  //文档说什么默认是用的es的import 导入文件模块的，
               outputPath: "images",  //打包后的文件目录
           }
       }
   },
  `
  
  - 图片，css，js文件的url，自动补全，添加host
  
  publicPath
  
  ` 
  {  
       test: /\.(png|svg|jpg|gif|jpeg)$/,
       use: {
           loader: "url-loader",   //html-withimg-loader 那边流到这里，只要图片大小很小，就不走file-loader
           options: {
               limit: 200 * 1024,
               esModule: false,  //文档说什么默认是用的es的import 导入文件模块的，
               outputPath: "images",  //打包后的文件目录
               publicPath: 'localhost:3000/dist/images'   //静态资源的host补全
           }
       }
   },
   
     {
       test: /\.s?css$/,
       use: [
           // {
           //     loader: "style-loader",
           //     //options: {insert: "top"}  //控制打包后的css标签放在html内的原本有的style标签前面，覆盖用的
           // },
           // 'style-loader',   //css数据流放入style标签
           //压缩css文件：
           {
               loader: MiniCssExtractPlugin.loader,
               options: {
                   publicPath: 'localhost:3000/dist/css'   //静态资源的host补全
               }
           }, //独立成一个css文件
       ]
   }
  `
  
  ## 多页面打包
  
  - 入口：
  
  ` entry:{
           home:"./src/index.js",other:'./src/other.js'   //多文件
       },`
  
  
  - 出口：
  
  ` output: {
           // filename: "bundle.[hash:5].js",  //文件名，哈希，避免覆盖，或者缓存问题
           filename: "[name].[hash:5].js",   //多文件
           path: path.resolve(__dirname, "./dist") , //路径绝对路径
           //publicPath: "http://baidu.com" ,  //静态资源的host地址拼接！图片，css，js文件们的url拼接,
           // 这里设置，就是所有的静态资源都要跟它拼接，局部的都在各个打包的模块里进行单独设置！
       },`
  
  - 插入html :
  
  chunks字段！ 几个页面，几个实例！
  
  `  new HtmlWebpackPlugin({  //多页面
               template: "./src/index.html",  //html地址
               filename: "home.html",  //输出文件名
               minify: {  //压缩html
                   removeAttributeQuotes: true, //删除html中的双引号
                   collapseWhitespace: true, //折叠空行html
                   hash: true, //缓存问题
               },
               chunks: ['home']
           }),
           new HtmlWebpackPlugin({  //多页面
               template: "./src/index.html",  //html地址
               filename: "other.html",  //输出文件名
               minify: {  //压缩html
                   removeAttributeQuotes: true, //删除html中的双引号
                   collapseWhitespace: true, //折叠空行html
                   hash: true, //缓存问题
               },
               chunks: ['other']
           }),`
  
  ## source map
  
  源码映射，调试到源代码！
 
 ` devtool:'xxxxx'`
 
 - sourcemap文件，标识行列：
 
 `devtool:'source-map'
 `
 
 - 无文件，有行列：
 
 `devtool:"eval-source-map"
 `
 - 无列，有单独文件：
 
 `devtool:'cheap-module-source-map'
 `
 
 - 无文件，无行列，集成在打包后的文件中：
 
 `devtool:'cheap-module-eval-source-map'
 `  
 
 ## watch 响应式打包
 
 `watch:true`
 - watchOptions   
 
 `watchOptions: {
          poll:1000,   //每秒轮询500次
          aggregateTimeout: 500,   //防抖，一直输入代码，500毫秒后再打包
          ignored: /node_modules/    ,   //忽略
      },`
      
 ## clean-webpack-plugin
 
 每次打包都会先清除dist目录，然后重新创建dist目录，打包！
 `        new CleanWebpackPlugin(),  //每次打包都会删掉dist，重新创建
`
 
 ## copy-webpack-plugin
 
 把一些目录文件拷贝到dist目录下，打包时！！
 
 `  new CopyPlugin(
              [
                  {from:'copy',to:'copy'} , //这里to，默认是打包的根目录下的相对位置
              ]
          ),    //打包时，拷贝一些目录到打包的路径下
    `
 
 ## bannerPlugin
 
 `new webpack.BannerPlugin(`by liu ,timer = ${new Date()}`), //打包时添加首行标注提示`
 
## 跨域


- proxy

请求的host是当前的webpack-dev-server的！
webpack-dev-server也是个server，它可以接收到请求，然后自己再转发给真的目标路由！

请求：

`const xml = new XMLHttpRequest();
 xml.open("GET", "/api/user", true);
 //这里访问的是当前webpack-dev-server的端口，webpack的server监听，然后转发！
 //http-proxy设置
 xml.onload = () => {
     console.log(xml.response, "跨域测试！！");
 };
 xml.send();`
 
 配置文件：
 
 ` devServer: {  //开发服务器配置
          port: 3000,  //端口
          progress: true,//进度条
          contentBase: "./dist", //打开的目录
          compress: true,//Gzip压缩
          overlay: true, //eslint 校验代码语法不合规范就报错！
          before (app) {  //转发之前，调用方法，mock数据测试的！前端开发！
              app.get("/api/user", (req, res) => {    //这里的路由要完全匹配的！！坑！
                  res.json({data: "mock test 不跨域！"});    //这里会中断后面的转发！！！
              });
          },
          proxy:{
             // '/api':'http://localhost:8081'   , //跨域设置，匹配当前webpack-dev-server的端口的'/api/***',转发给8081端口！
              '/api':{
                  target:'http://localhost:8081',   //注意，一定要加上http://，否则报错！
                  pathRewrite:{        //前端自定义一级路由：
                      '/api':''
                  }
              }
          },
      },
    `
      
      目标server：

 `const express = require("express");
  const webpack = require("webpack");
  const webpackDevMiddle = require("webpack-dev-middleware");
  const config = require("../webpack.config");
  //const webs = webpack(config);
  //打包生成当前服务器的host文件！而不是webpack-dev-server的server,无法用before mock了！
  const server = express();
  //server.use(webpackDevMiddle(webs));
  server.get("/user", (req, res) => {
      res.send({data: "test 跨域！！"});
  });
  server.listen(8081, () => {
      console.log("server start!");
  });
  `
 
 - mock 数据
 
 在webpack-dev-server拿到请求后，就不转发了，自己回复mock的数据！用的before钩子函数！
 
 
 - 在server端进行打包，使得webpack-dev-server与server的host其实是一个。
 
 就是在服务端开发前端页面了！
 
    
    
## resolve 配置

配置webpack运行时的细节控制：自身如何运行，自身如何运行第三方包！

- 查找

可以配置查找的目录：
`
resolve: {
        modules: [path.resolve("node_modules")],   //指定查找的目录，不需要默认机械查找，浪费时间
        // alias: {  //别名配置，简单省事！
        //     bootstrap: "bootstrap/dist/css/bootstrap.css"
        // },
        mainFields: [ //入口字段，优先匹配什么字段的
            'style','main'
        ],
        extensions: ['.js','.css','.scss','.json'],  //省略掉文件后缀后，导入时，如何按顺序匹配
    },`

- 很多导入准确的文件依赖很难：

`//import "bootstrap";  //test resolve 配置，设置默认查找路径
 // 报错，./node_modules/bootstrap/dist/js/bootstrap.js。不是css文件！！！
 //import 'bootstrap/dist/css/bootstrap.css'  //如此才对！！但是太麻烦了，用到alias字段了！
 import 'bootstrap'  //配置了alias之后，可以方便导入了！` 
 
 - 如何导入时，不写文件后缀？
 
 `import 'b'  //省略css文件后缀，如何配置resolve，extensions 扩展名`
 
 
##  定义环境变量

webpack.DefinePlugin

` new webpack.DefinePlugin({  //定义环境变量，跟全局变量很像！只不过是简单的值，一般都是常量，比如区分dev,pro。
             MODE:"'dev'",
             xyz:888
         }),`

## 区分不同的环境

webpack-merge  //合并对象的！
dev,pro的分开的配置文件！
webpack.config.base.js
webpack.config.dev.js
webpack.config.pro.js


# 优化

## react  与 babel

`@babel/preset-react`  专门解析react的！

## 打包时，不去解析某些包，不去看它的依赖！忽略掉某些包，比如jquery，这种不依赖其他包的包！

`noParse:/jquery/`    //module中的字段

## 打包时指定排除或包含的目录地址

`  {  //转es5
     test: /\.m?js$/,
     exclude: /node_modules/,  //查找的js文件的范围，还有include:
     include: path.resolve(__dirname, "src"),
     use: {
         loader: "babel-loader",   //解析js文件数据
         options: {
             presets: [
                 "@babel/preset-env",
                 "@babel/preset-react" ,  //解析react的
             ],   //映射转化一些高级语法
             plugins: [
                 ["@babel/plugin-proposal-decorators", {"legacy": true}],//class
                 ["@babel/plugin-proposal-class-properties", {"loose": true}], //装饰器
                 //多个引用转译后的代码，会使同一个被转译的目标多次被转译，代码浪费：
                 "@babel/plugin-transform-runtime", //同时还依赖@babel/runtime，生产环境时候，帮着产生补丁的，这是代码本身的依赖，不是 -dev--save
             ],
         },
     }
 },`

## 对一个包的多个依赖进行筛选加载，先全部都不加载，再自己手动加载，自己需要的！

手动引入包的一些依赖，强制所有的默认引入忽略，进行包的体积优化！，moment为例   ：    
moment有多重语言支持的语言包，默认全加载各国语言！！太大了！
默认require的加载忽略掉，然后手动导入自己的所需！这是思路！

import moment from "moment";

// import 'moment/locale/zh-cn'
moment.locale("zh-cn");
//坑！！我试了下，盲猜moment做了优化了，默认只导入英语，或者指定的语言！
// 害我试了好久，发现怎么操作，匹配都是打包无明显变化！
// 通过不设置忽略加载，我这里做了语言选择，发现一直都是英语而不是中文，这里也可以有些猜疑了！！这案例要更新了！！
console.log(moment().endOf("day").fromNow(), "moment 按需加载依赖！！test");

技能点就是：
` new webpack.IgnorePlugin(    //手动禁止默认加载的依赖包，需要文件中手动导入自己所需要的包！！！
             /\*+\/locale\*+/,    //包的那些依赖名字的字段
             /moment/    //哪个包
         )
         而导入区那里，要自己手动导入：
          import 'moment/locale/zh-cn'
   `
   原理明白就好！这个所谓的官方范例，估计要崩了！
   
## 动态链接库

 react + react-dom为例：
 
 问题：一些dependents，非devdependents！它们保持不变！开发时每次都会导入，触发解析和打包！
 每次的解析和打包后的结果都一样！如何一次性打包后，以后开发就不打包解析它们了，直接拿打包后的结果多好！
 优化点其实是开发时重复的解析打包的消耗！
 
 用的是动态链接库！
 原理就是面向上面的目标的！以react,react-dom这两个依赖来说，
 单独把他两个打包压缩了！
 然后建立映射：
 原本如何导入react,react-dom的，用法不变！保持官方统一一致！
 然后让webpack建立映射！在导入时，先去匹配一个字典！这个字典记录了打包压缩的文件数据，与查找路径的映射！
 如何生成这个字典？？
 那就只能在打包压缩那些文件的时候，建立了！这是约定规范的意义！
 
 - 打包 + 建立字典映射规范：
 webpack.react.js:   打包一个react.js文件，内容随意：
 `const path = require("path");
  module.exports = {
      entry: {react: "./react.js"},
      output: {
          filename: "[name].js",
          path: path.resolve(__dirname, "./dist")
      },
      mode: "development"
  };
 `
 
 打包后的结果是个闭包函数，函数的返回值是文件的module.exports的值！
 这个值跟文件路径是想要的字典的键值对！
 如何生成键？？？
 ` output: {
          filename: "[name].js",
          path: path.resolve(__dirname, "./dist"),
          library: 'react'  //这里加个这个，会对打包的闭包函数的值赋值，
          //得到了 var react = 那个闭包函数 = react.js文件的module.exports的值
      },`
 
 - 开始正式实现：
 `module.exports = {
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
 `
 字典 = manifest.json :
 `{
      "name": "_dll_react",
      "content": {
          "./node_modules/object-assign/index.js": {
              "id": "./node_modules/object-assign/index.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/prop-types/checkPropTypes.js": {
              "id": "./node_modules/prop-types/checkPropTypes.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/prop-types/lib/ReactPropTypesSecret.js": {
              "id": "./node_modules/prop-types/lib/ReactPropTypesSecret.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/react-dom/cjs/react-dom.development.js": {
              "id": "./node_modules/react-dom/cjs/react-dom.development.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/react-dom/index.js": {
              "id": "./node_modules/react-dom/index.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/react/cjs/react.development.js": {
              "id": "./node_modules/react/cjs/react.development.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/react/index.js": {
              "id": "./node_modules/react/index.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/scheduler/cjs/scheduler-tracing.development.js": {
              "id": "./node_modules/scheduler/cjs/scheduler-tracing.development.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/scheduler/cjs/scheduler.development.js": {
              "id": "./node_modules/scheduler/cjs/scheduler.development.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/scheduler/index.js": {
              "id": "./node_modules/scheduler/index.js",
              "buildMeta": {
                  "providedExports": true
              }
          },
          "./node_modules/scheduler/tracing.js": {
              "id": "./node_modules/scheduler/tracing.js",
              "buildMeta": {
                  "providedExports": true
              }
          }
      }
  }`
 
 - 如何用字典直接拿到依赖的包？？
 
 首先把打包文件导入到html中，成为一个全局的对象！
 
 `<script src="./_dll_react.js"></script>
这里我犯错了！导入的url，是从dist目录为开始路径设置的！！
`
  webpack.config.js中：
  拦截默认查找react,react-dom到node_modules里找，去字典里去匹配，
  ` new webpack.DllReferencePlugin({  //
               manifest:path.resolve(__dirname,'dist',"manifest.json")
           })
  `
  实际打包的体积小了2M左右，想想多减压吧！当然这是对开发时的优化，而不是生产时候还要如此分开打包的！
  
  
  ## 多线程打包
  
  happypack 依赖！作用在loader那里！
  注意，项目比较大，某种类型的文件打包很耗时，可以用。因为开辟新线程工作也是要消耗时间的！
  
  module中 ：
  
  ` {  //转es5
       test: /\.m?js$/,
       exclude: /node_modules/,  //查找的js文件的范围，还有include:
       include: path.resolve(__dirname, "src"),
       use: "Happypack/loader?id=js", //多线程打包：哪种类型的打包比较耗时，就单独开辟一个线程专门打包，多线程并行
       // use: {
       //     loader: "babel-loader",   //解析js文件数据
       //     options: {
       //         presets: [
       //             "@babel/preset-env",
       //             "@babel/preset-react",  //解析react的
       //         ],   //映射转化一些高级语法
       //         plugins: [
       //             ["@babel/plugin-proposal-decorators", {"legacy": true}],//class
       //             ["@babel/plugin-proposal-class-properties", {"loose": true}], //装饰器
       //             //多个引用转译后的代码，会使同一个被转译的目标多次被转译，代码浪费：
       //             "@babel/plugin-transform-runtime",
       //             //同时还依赖@babel/runtime，生产环境时候，帮着产生补丁的，这是代码本身的依赖，不是 -dev--save
       //         ],
       //     },
       //
       // }
   },
  `
  plugin中：
  ` new Happypack({  //多线程打包设置，适用于一些类型的包的打包时间比较长的时候！
       id:'js',
       use: [{
           loader: "babel-loader",   //解析js文件数据
           options: {
               presets: [
                   "@babel/preset-env",
                   "@babel/preset-react",  //解析react的
               ],   //映射转化一些高级语法
               plugins: [
                   ["@babel/plugin-proposal-decorators", {"legacy": true}],//class
                   ["@babel/plugin-proposal-class-properties", {"loose": true}], //装饰器
                   //多个引用转译后的代码，会使同一个被转译的目标多次被转译，代码浪费：
                   "@babel/plugin-transform-runtime",
                   //同时还依赖@babel/runtime，生产环境时候，帮着产生补丁的，这是代码本身的依赖，不是 -dev--save
               ],
           },
       }]
   })`
   
  ## webpack 自带优化
  
  - tree shaking 
  没引用到包里的一些属性的代码，就不会production打包进来！注意：**import 引入**才可以！！
  es6模块会把结果放在default上！
  es6导入的属性代码才会被打包，导入的包的其他的不用的代码，不会被production打包进来！
  require 不支持！！！
  
  - scope hosting 
  作用域提升！ production 模式！！！
  自动省略中间过程性的代码，可以简化，等效的结果代替！
  `
  let a = 4
  let b = 3
  let c = 7
  let d =  a+b+c
  conmsole.log(d)
  //打包这一堆代码得出： console.log(14)
  `
  
  ## 抽离公共代码
  多页面共有的代码，就会抽取！跟之前的动态链接库有些同样类似的价值！减少不必要的打包开销！
  抽离目标：公共的代码，公共的第三方模块！公共的代码就包含了公共的第三方模块了。
  但是公共的第三方模块单独打包比较好！所以需要配置权限的！
  optimization -> splitChunks -> cacheGroups -> common
  
  - 抽离公共代码：
  `
   optimization: {  //优化项,生产模式才用的：
      minimizer: [
          //对css文件的压缩，这里js文件不会默认压缩，需要配置js的压缩：
          new OptimizeCssAssetsPlugin(),
      ],
      splitChunks:{ //分割代码块
          cacheGroups:{ //缓存组
              common:{//公共的模块
                  chunks:'initial',
                  minSize:0,
                  minChunks:2,  //这里是至少两次依赖
              }
          }
      }
  },`
  
  - 抽离公共的第三方依赖：
  
  ` optimization: {  //优化项,生产模式才用的：
       minimizer: [
           //对css文件的压缩，这里js文件不会默认压缩，需要配置js的压缩：
           new OptimizeCssAssetsPlugin(),
       ],
       splitChunks:{ //分割代码块
           cacheGroups:{ //缓存组
               common:{//公共的模块
                   chunks:'initial',
                   minSize:0,
                   minChunks:2,  //这里是至少两次依赖
               },
               vendor:{   //因为代码是从上到下执行的，它会先执行common那里，连带着抽离了第三方依赖：
                   //所以，想要单独抽离出来第三方依赖，需要权重：
                   priority:1,   //权重，先抽离第三方依赖，没有这个，只会把所有的公共代码全抽离成一个文件
                   test:/node_modules/  , //抽离模块匹配
                   chunks:'initial',
                   minSize:0,
                   minChunks:2,  //这里是至少两次依赖
               }
           }
       }
    },`
  
  
  
  
  
    
   


