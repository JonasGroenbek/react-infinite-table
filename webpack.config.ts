import path from 'path'
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const configuration: Configuration = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: [
            path.resolve(__dirname, "**/*.spec.ts"),
            path.resolve(__dirname, "node_modules")
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", '.js'],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 3000
  }
};

export default configuration