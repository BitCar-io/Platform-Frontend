// @flow

// #region imports
const webpack = require('webpack');
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// #endregion

// #region constants
const outputPath = path.join(__dirname, '../dist/assets');
const publicPath = './assets/';
const nodeModulesDir = path.join(__dirname, '../node_modules');
const indexFile = path.join(__dirname, '../src/index.js');
const srcInclude = path.join(__dirname, '../src');
// #endregion

const config = {
  mode: 'production',
  entry: { app: indexFile },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', 'jsx', '.ts', '.tsx'],
  },
  output: {
    path: outputPath,
    publicPath,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            include: srcInclude,
            exclude: [nodeModulesDir],
            loaders: ['babel-loader'],
        },
        {
            test: [/\.css$/, /\.scss$/],
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
      {
        test: /\.(woff|woff2|eot|ttf|svg|otf|svg|png|jpe?g|gif)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
      }),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new Dotenv({
        path: './config/.env.production'
    }),
    new HtmlWebpackPlugin({
        filename: '../index.html',
        template: 'src/statics/index.html',
        favicon: 'src/statics/favicon.ico',
    }),
    new ModernizrWebpackPlugin({
      htmlWebpackPlugin: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8,
    }),
    // IPORTANT: we need to serve app through https otherwise SW will throw error (so no SW in this simple case)
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  node: {
    dns: 'mock',
    net: 'mock'
  },
};

module.exports = config;
