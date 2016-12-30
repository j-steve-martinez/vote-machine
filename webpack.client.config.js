var path = require('path');
// var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');


const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'app');

module.exports = {

  entry: APP_DIR + '/client/views/index.jsx',

  output: {
      path: BUILD_DIR,
      filename: 'reactor.js'
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};
