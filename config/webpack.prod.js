const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

const prodConfig = {
	mode: 'production',
	output: {
		filename: "js/[name].[chunkhash:6].js",
		path: path.resolve(__dirname, '../tank-war'), // 打包后的目录
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				sideEffects: true,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
						},
					},
					"postcss-loader"
				],
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "💥💥💥开炮💥💥💥",
			// 选取一个html作为模版，在dist目录下会生成一个相同的html，之后将打包好的js注入到该html文件
			template: "./public/index.html",
			// 默认会使用一个插件html-minifier-terser
			minify: {
				removeComments: true,									// 移除注释
				collapseInlineTagWhitespace: false,		// 折叠空格
				removeRedundantAttributes: true,			// 移除多余的属性 type=text
				useShortDoctype: true,								// 比如我们的模板是html4，那么会转成html5的文档
				removeEmptyAttributes: true,					// 移除空的属性 id=""
				removeStyleLinkTypeAttributes: true,	// 比如link中的type="text/css"
				keepClosingSlash: true,								// 是否保持单元素的尾部/
				minifyCSS: false,											// 是否压缩html文件里写的css
				minifyJS: {
					mangle: {
						toplevel: true
					}
				}
			}
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:6].css'
		})
	],
	optimization: {
		/**
		 * 模块id采用什么算法生成
		 * natural 自然数(不推荐)。弊端见：第11课02:40:00
		 * named 使用包所在目录作为name(开发环境推荐)
		 * deterministic 生成id，针对相同文件生成的id是不变的
		 */
		// chunkIds: 'deterministic',
		// 未被使用的export出来的代码将被删除，默认值为true
		usedExports: true,
		// 是否使用下文minimizer中声明的插件
		minimize: true,
		minimizer: [
			// 对代码进行压缩相关的操作
      new TerserPlugin({
				// 在输出的bundle中不包含许可证文件
        extractComments: false,
				// 并发数量
				parallel: true,
				terserOptions: {
					compress: {
						arguments: true
					},
					mangle: true,
					keep_classnames: true,
					keep_fnames: true
				}
      })
    ]
  }
}

module.exports = prodConfig;
