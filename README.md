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
   
   
   3. 引入不打包，script标签形式！注意打包的时候，设置externals字段去掉它，因为script已经script标签引入了！
  
    
    
    



