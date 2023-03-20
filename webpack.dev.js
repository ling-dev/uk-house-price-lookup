const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/scripts/index.ts",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "./"),
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/custom.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
