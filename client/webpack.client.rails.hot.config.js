/* eslint comma-dangle: ["error",
  {"functions": "never", "arrays": "only-multiline", "objects": "only-multiline"} ] */

// Run with Rails server like this:
// rails s
// cd client && babel-node server-rails-hot.js
// Note that Foreman (Procfile.dev) has also been configured to take care of this.

const { resolve } = require('path');
const webpack = require('webpack');

const config = require('./webpack.client.base.config');
const { devServer, paths, publicPath } = require('./webpackConfigLoader.js');

config.entry.app.push(
  `webpack-dev-server/client?${devServer.host}:${devServer.port}`,
  'webpack/hot/only-dev-server'
);

// These are Rails specific
config.entry.vendor.push(
  'jquery-ujs',
  'bootstrap-loader'
);

config.output = {
  filename: '[name]-bundle.js',
  path: resolve('..', paths.output, paths.assets),
  publicPath,
};

config.module.rules.push(
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
      plugins: [
        [
          'react-transform',
          {
            superClasses: ['React.Component', 'BaseComponent', 'Component'],
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              },
            ],
          },
        ],
      ],
    },
  },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 0,
          localIdentName: '[name]__[local]__[hash:base64:5]'
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: 'autoprefixer'
        }
      }
    ]
  },
  {
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 3,
          localIdentName: '[name]__[local]__[hash:base64:5]',
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: 'autoprefixer'
        }
      },
      {
        loader: 'sass-loader'
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: './app/assets/styles/app-variables.scss'
        },
      }
    ],
  },
  {
    test: require.resolve('jquery-ujs'),
    use: {
      loader: 'imports-loader',
      options: {
        jQuery: 'jquery',
      }
    }
  }
);

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
);

config.devtool = 'eval-source-map';

console.log('Webpack dev build for Rails'); // eslint-disable-line no-console

module.exports = config;
