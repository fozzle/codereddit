var webpack = require('webpack');

module.exports = [
  {
    entry: './src/jsx/main.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.jsx']
    }
  },
  {
    entry: './src/jsx/main.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.min.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.jsx']
    }
  }
];
