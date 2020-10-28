const webpack = require('webpack');
const path = require('path');
const DIST_DIR = __dirname + '/static/frontend';

module.exports = {

  output: {
    path: DIST_DIR,
    publicPath: '/',
    filename: 'main.js'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, './src')
    ]
  }, 

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader"
        }
      }
    ]
  }
};