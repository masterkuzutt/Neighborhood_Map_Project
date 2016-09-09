// webpack.config.js
module.exports = {
  entry: {index : './src/js/index.js'},
  output: {
    filename: './dst/js/[name].js'
  },
  // module:{
  //   loaders: [
  //     { test: './src/css/cssstyle.css', loader: "style!css" },
  //   ]
  // }
};
