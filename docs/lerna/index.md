---
nav: Lerna 使用
toc: content
---

## 痛点

1、以前的组件都是单个维护的,自己梳理组件之间的关系(套娃)

2、git 仓库管理混乱,基本上发布组件后没有打 Tag

## 基于现有的组件库仓库进行改造

1、引入 Lerna（lerna init --independent）ps:先全局安装一下 lerna 包

      lerna存在2种工作模式：

          a: Fixed/Locked mode (default)

               vue,babel都是用这种，在publish的时候,会在lerna.json文件里面"version": "0.1.5",,依据这个号，进行增加，只选择一次，其他有改动的包自动更新版本号。

          b:  Independent mode

              每次publish时，您都将得到一个提示符，提示每个已更改的包，以指定是补丁、次要更改、主要更改还是自定义更改。

当前工作模式查看 lerna.json 文件里面 `"version": "independent"` 字段

## 使用 Lerna

1、清理 node_models

git 提交记录中默认是排除掉 node_models 包的，所以需要所有的组件都把包拉取下来

     lerna clean  删除所有子包中的node_modules 目录,根目录的 node_modules 不会删除

     使用 lerna bootstrap 拉取所有组件的 node_models

     在运行时，该命令(lerna bootstrap)：

        1、npm install每个包所有的外部依赖。
        2、将所有相互依赖的 Lerna package符号链接在一起。
        3、在所有引导包中运行npm run prepublish(除非使用 lerna bootstrap --ignore-prepublish)

2、默认使用的是 npm install 拉包命令，如果拉包慢的话可以可以切换为 yarn 、增加 --prefer-offline 从缓存中拉

```json
{
  "npmClient": "yarn",
  "npmClientArgs": ["--prefer-offline"]
}
```

3、修改组件代码逻辑
修改完后运行 lerna publish 发布包

`注意事项:`

1、publish 时如果在发布时出了问题，git 记录一样也会 push 成功，但版本发布失败，再次发布时会提示无更改内容

        解决办法:
                a: lerna publish from-git   https://github.com/huruji/blog/issues/67
                b: 删除tag重新来

2、`lerna publish` 需要执行 package.json->script->prepublish 中的命令来重新打包, 所以每个包中 package.json 文件中都需要指定 `prepublish` 命令不然就不会重新打包，dist 文件夹不会更新甚至是没有(新拉的库的时候，dist 文件夹是排除了 git 管理的)

```json
    "scripts": {
    "clean": "rimraf ./dist",
    "test": "echo Error: missing tests",
    "build:dev": "npm run clean && webpack --config ./config/webpack.dev.js",
    "build": "npm run clean && webpack --config ./config/webpack.prod.js",
    "analyzer": "npm run clean && webpack --config ./config/webpack.analyzer.js",
    "build:rollup": "npm run clean && rollup -c config/rollup.config.js && node main.js",
    "prepublish": "npm run build"
},
```
