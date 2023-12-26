const HtmlWebpackPlugin = require('html-webpack-plugin');

const devConfig = {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.css$/,
				sideEffects: true,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
						},
					},
					"postcss-loader"
				],
			},
		]
	},
	devServer: {
		client: {
			overlay: false
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "tank war dev",
			// 选取一个html作为模版，在dist目录下会生成一个相同的html，之后将打包好的js注入到该html文件
			template: "./public/index.html"
		})
	]
}

module.exports = devConfig;
