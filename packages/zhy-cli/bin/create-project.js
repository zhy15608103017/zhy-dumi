#!/usr/bin/env node
// 这样包装后，引入的模块文件可以使用最新的 ES语法
const req = require("esm")(module /*, options*/);
// 属性会返回一个数组，其中包含当 Node.js 进程被启动时传入的命令行参数
// @process.argv  命令行参数
req("../src/cli").cli(process.argv);