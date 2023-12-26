const path = require('path')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')
const prodConfig = require('./webpack.prod')
const devConfig = require('./webpack.dev')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const commonConfig = {
  entry: path.resolve(__dirname, '../src/main.js'),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset',
        generator: {
          filename: 'img/[name].[contenthash:6][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[contenthash:6][ext]',
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      BASE_URL: '"./"'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          globOptions: {
            ignore: [
              '**/DS_store',
              // "**/photo.jpg",
              // 不忽略的话会和生成的同名html冲突
              '**/index.html',
              '**/*.html',
            ],
          },
        },
      ],
    }),
  ],
}

module.exports = env => {
  // console.log('------', env);
  // console.log('------', process.env.NODE_ENV);
  const config = merge(commonConfig, process.env.NODE_ENV === 'production' ? prodConfig : devConfig)
  return config
}
