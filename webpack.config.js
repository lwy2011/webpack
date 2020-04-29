const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
module.exports = {
    entry: "./src/index.js",//入口
    // entry:{
    //     home:"./src/index.js",other:'./src/other.js'   //多文件
    // },
    output: {
        // filename: "bundle.[hash:5].js",  //文件名，哈希，避免覆盖，或者缓存问题
        filename: "[name].js",   //多文件
        path: path.resolve(__dirname, "./dist") , //路径绝对路径
        //publicPath: "http://baidu.com" ,  //静态资源的host地址拼接！图片，css，js文件们的url拼接,
        // 这里设置，就是所有的静态资源都要跟它拼接，局部的都在各个打包的模块里进行单独设置！
    },
    mode: "development", //生产模式，开发模式 production
    devtool: 'cheap-module-eval-source-map',    //源码映射：调试用的，多种配置
    watch:true,  //响应式的打包
    watchOptions: {
        poll:1000,   //每秒轮询500次
        aggregateTimeout: 500,   //防抖，一直输入代码，500毫秒后再打包
        ignored: /node_modules/    ,   //忽略
    },
    devServer: {  //开发服务器配置
        port: 3000,  //端口
        progress: true,//进度条
        contentBase: "./dist", //打开的目录
        compress: true,//Gzip压缩
        overlay: true, //eslint 校验代码语法不合规范就报错！
    },
    plugins: [  //插件
        new HtmlWebpackPlugin({
            template: "./src/index.html",  //html地址
            filename: "index.html",  //输出文件名
            minify: {  //压缩html
                removeAttributeQuotes: true, //删除html中的双引号
                collapseWhitespace: true, //折叠空行html
                hash: true, //缓存问题
            }
        }),
        // new HtmlWebpackPlugin({  //多页面
        //     template: "./src/index.html",  //html地址
        //     filename: "home.html",  //输出文件名
        //     minify: {  //压缩html
        //         removeAttributeQuotes: true, //删除html中的双引号
        //         collapseWhitespace: true, //折叠空行html
        //         hash: true, //缓存问题
        //     },
        //     chunks: ['home']
        // }),
        // new HtmlWebpackPlugin({  //多页面
        //     template: "./src/index.html",  //html地址
        //     filename: "other.html",  //输出文件名
        //     minify: {  //压缩html
        //         removeAttributeQuotes: true, //删除html中的双引号
        //         collapseWhitespace: true, //折叠空行html
        //         hash: true, //缓存问题
        //     },
        //     chunks: ['other']
        // }),
        new MiniCssExtractPlugin({  //抽离css单独成一个css文件
            filename: "css/main.css" ,   //这里可以设置文件的目录！！！
        }),
        // new webpack.ProvidePlugin({  //全局各个模块默认注入变量：
        //     $:'jquery'
        // })
    ],
    optimization: {  //优化项,生产模式才用的：
        minimizer: [
            //对css文件的压缩，这里js文件不会默认压缩，需要配置js的压缩：
            new OptimizeCssAssetsPlugin(),
        ],

    },
    externals: {  //不需要打包的依赖：比如外部用script的全局文件变量,内部文件中有人又导入这个依赖了
        jquery: "$"
    },
    module: {//模块
        rules: [  //规则,匹配文件，处理文件


            // {   //图片打包，先引入图片，引入的值实质是一个hash的图片地址！！
            //     test: /\.(png|svg|jpg|gif|jpeg)$/,
            //     use: {
            //         loader: "file-loader",
            //         options: {
            //             esModule: false,  //文档说什么默认是用的es的import 导入文件模块的，
            //             // 而不是CommonJS ，这里不设置它，就会使得下面处理html的img失效，
            //             // 我猜html-withimg-loader是commonJS 的结果写的，而es输出的结果成了一个对象了！
            //             outputPath: "images",
            //         }
            //     }
            // },

            {   //为了小图片，没必要发请求，打包的不是地址，而是图片的base64数据流，作为img的 src！放入js文件中，等待插入！
                //一旦文件超出limit，会自动用file-loader，不用设置file-loader!!但是要下载这个依赖！！！！
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
            { //处理html中的图片
                test: /\.html$/,
                use: "html-withimg-loader"  //图片很小的时候，不适合用，可以用url-loader ,src = base64数据流
            },
            // {
            //     //css-loader 解析css文件引入css文件的，style-loader把css文件数据插入到html中
            //     //loader 有顺序的,默认从右向左，从下到上执行！
            //     //更多的参数配置写法：{loader:'style-loader',options:{**:**}}
            //     test:/\.css$/,
            //     use:['style-loader','css-loader']
            // },
            {
                // less , sass stylus node-sass sass-loader ,stylus stylus-loader
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
                    "css-loader",   //css文件@import css文件
                    "postcss-loader",  //转成css数据类型后加前缀
                    "sass-loader"  //scss转为css
                ]
            },
            {  //转es5
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
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
                        exclude: /node_modules/,  //查找的js文件的范围，还有include:
                        include: path.resolve(__dirname, "src"),
                    },

                }
            },

            // {
            //     //校验：eslint
            //     // 需要 eslint ,eslint-loader ,并去其官网选择对应的设置，下载.eslintrc.json文件做配置！
            //     //https://eslint.org/demo/
            //     test: /\.js$/,
            //     use: {
            //         loader: "eslint-loader",
            //         options: {fix: true},//浅显的语法问题，自动修复！
            //     },
            //     enforce:'pre'   ,//强制先执行后处理js。
            // },

            // {    //暴露全局变量的时候，用expose-loader做，
            //     // 同样的，入口文件，顶级优先导入jquery，否则先导入其他模块可能会用的时候，window.$还不存在！
            //     test: require.resolve('jquery'),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: 'jQuery'
            //     },{
            //         loader: 'expose-loader',
            //         options: '$'
            //     }]
            // },


        ]
    }
};