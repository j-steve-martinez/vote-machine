var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'public/css');
const APP_DIR = path.resolve(__dirname, 'app/client');

module.exports = {
  entry: APP_DIR + '/styles/main.scss',
  output: {
    path: BUILD_DIR,
    filename: 'main.js'
  },
  resolve: {
    extensions: ['', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("main.css")
  ]
};
