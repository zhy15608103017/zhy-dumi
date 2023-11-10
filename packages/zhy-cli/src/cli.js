import chalk from 'chalk';
import get from 'lodash/get';
import pjson from '../package.json';
import { createProject } from './main';
import parseArgumentsIntoOptions from './utils/parseArgumentsIntoOptions';
import promptForMissingOptions from './utils/promptForMissingOptions';

// 入口方法，接收命令行参数
export async function cli(args) {
  // 获取自定义命令行参数
  let options = parseArgumentsIntoOptions(args);
  // 打印版本信息
  if (get(options, 'version')) {
    return console.log(chalk.green(`当前cli版本为 : ${pjson.version}`));
  }
  // 提供帮助
  if (get(options, 'help')) {
    return console.log(chalk.green('直接运行zhy-cli就能拉取模版了'));
  }
  // 获取交互步骤数据
  options = await promptForMissingOptions(options);
  // 执行
  await createProject(options);
}
