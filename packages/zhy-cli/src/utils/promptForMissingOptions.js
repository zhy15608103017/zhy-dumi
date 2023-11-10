import inquirer from "inquirer";
import get from "lodash/get";
export default async function promptForMissingOptions(options) {
  const questions = [];
  // 如果没有指定
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "请选择工程类型",
      choices: ["普通项目", "widget", '组件模版'],
    },{
      type: "input",
      name: "name",
      message: "请输入模版名称",
      default: "template"
    },{
      type: "input",
      name: "gitUrl",
      message: "请输入项目初始git地址",
      default: null
    }
    );
  }
  // 命令行交互工具
  // @questions 交互流程参数
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: get(options, "template", answers.template),
    packageName: answers.name,
    gitUrl: answers.gitUrl,
  };
}