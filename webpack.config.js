const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
    entry: "./src/index.js",//入口
    output: {
        filename: "bundle.[hash:5].js",  //文件名，哈希，避免覆盖，或者缓存问题
        path: path.resolve(__dirname, "./dist")  //路径绝对路径
    },
    mode: "development", //生产模式，开发模式 production
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
        new MiniCssExtractPlugin({  //抽离css单独成一个css文件
            filename: "main.css"
        }),

    ],
    optimization: {  //优化项,生产模式才用的：
        minimizer: [
            //对css文件的压缩，这里js文件不会默认压缩，需要配置js的压缩：
            new OptimizeCssAssetsPlugin(),
        ]
    },
    module: {//模块
        rules: [  //规则,匹配文件，处理文件
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
                    MiniCssExtractPlugin.loader,   //独立成一个css文件
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
        ]
    }
};