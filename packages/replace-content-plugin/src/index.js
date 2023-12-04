/* eslint-disable no-param-reassign */
const path = require('path');
class ReplaceContentPlugin {
  constructor(options) {
    // 插件配置
    this.options = options || {};
    this.packageJsonName = '';
  }
  apply(compiler) {
    // 注册 beforeCompile 钩子，该钩子在编译前运行
    compiler.hooks.beforeCompile.tapAsync(
      'replace-content-plugin',
      (params, callback) => {
        // 获取项目根目录
        const projectRoot = compiler.options.context || process.cwd();

        // 获取package.json文件路径
        const packageJsonPath = path.resolve(projectRoot, 'package.json');

        try {
          // 使用require获取package.json的内容
          const packageJson = require(packageJsonPath);

          // 获取指定属性
          const targetProperty = this.options.targetProperty || 'name';
          this.packageJsonName = packageJson[targetProperty];

          // 可以在这里使用获取到的属性值进行进一步处理

          // 完成插件的执行
          callback();
        } catch (err) {
          console.error(`Error reading or parsing package.json: ${err}`);
          callback(err);
        }
      },
    );

    // 注册 emit 钩子
    compiler.hooks.emit.tapAsync(
      'replace-content-plugin',
      (compilation, callback) => {
        // 遍历所有文件
        Object.keys(compilation.assets).forEach((filename) => {
          // 匹配指定文件类型
          if (filename.match(/\.js$/)) {
            // 获取文件内容
            let source = compilation.assets[filename].source();
            // 使用正则表达式替换并
            if (typeof source === 'string') {
              source = this.modifySymbolIds(source, this.packageJsonName);
            }
            // 更新文件内容
            compilation.assets[filename] = {
              source: () => source,
              size: () => source.length,
            };
          }
        });

        // 完成插件逻辑
        callback();
      },
    );
  }
  modifySymbolIds(svgContent, packageJsonName) {
    // 在这里编写修改 <symbol> 标签上 id 属性的逻辑
    svgContent = svgContent.replace(/<symbol id="(.+?)"/g, (match, id) => {
      // 在这里对 id 进行修改
      const modifiedId = packageJsonName + id;
      return `<symbol id="${modifiedId}"`;
    });
    const regex = /xlinkHref\s*:\s*"#"\s*\.\s*concat/g;
    if (svgContent.match(regex)) {
      svgContent = svgContent.replace(regex, (match) => {
        return match + `("${packageJsonName}").concat`;
      });
    }
    return svgContent;
  }
}

module.exports = ReplaceContentPlugin;
