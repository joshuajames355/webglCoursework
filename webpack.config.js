var path = require('path');

module.exports = {
    entry: "./src/main.ts",
    devtool: 'eval-source-map',
    resolve: {
      extensions: [".ts", ".js"]
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          use: {
            loader: "awesome-typescript-loader"
          }
        }
      ]
    }
  };