const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // Entry point for the React app
  output: {
    filename: 'bundle.js',  // Output bundled file
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Use Babel to transpile JavaScript files
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/, // Matches .css files
        use: ['style-loader', 'css-loader'], // Use these loaders
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  // Template for generating the HTML file
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 4000,
  },
};
