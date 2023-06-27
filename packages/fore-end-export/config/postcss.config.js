const less = require('less');

// 用于解析less 网上抄的
const processLess = function (context, payload) {
  return new Promise((resolve, reject) => {
    less.render(
      {
        file: context,
      },
      function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      },
    );

    less.render(context, {}).then(
      function (output) {
        // output.css = string of css
        // output.map = string of sourcemap
        // output.imports = array of string filenames of the imports referenced
        if (output && output.css) {
          resolve(output.css);
        } else {
          reject({});
        }
      },
      function (err) {
        reject(err);
      },
    );
  });
};

const plugins = [
  // 用于解析嵌套规则
  require("postcss-nested"),
  // 用于解析@import规则
  require("postcss-import"),
  // 对css降级
  require("postcss-preset-env")({
    browsers: ["last 2 versions", "> 5%"],
  }),
  // 添加浏览器前缀
  require("autoprefixer"),
  // css压缩
  require("cssnano"),
  // 用于处理css里面的图片
  require("@sixian/css-url").cssUrl({
    imgOutput: "dist/assets",
    fontOutput: "dist/assets",
    cssOutput: "dist",
  }),
];

// postcss 配置
const rollPostcssConfig = {
  plugins,
  extract: true,
  use: {
    less: {
      modifyVars: {
        '@ant-prefix': 'jusda-header',
        'primary-color': '#ffc500',
      },
      javascriptEnabled: true,
    },
  },
  process: processLess,
  extensions: ['.css', '.less'],
};

module.exports = rollPostcssConfig;