// 命令行美化工具
import chalk from "chalk";
// 用于递归复制文件
import path from "path";
// 终端任务列表
import Listr from "listr";
// 依赖安装工具
import { projectInstall } from "pkg-install";
import get from "lodash/get";
// 删除工具
import rimraf from "rimraf";
// 子进程
import { spawn, exec } from "child_process";
const fs = require('fs');
// 模版地址
const codeWarehouse = {
  '普通项目': 'https://gitee.com/zhonghaiyan/template.git',
  'widget': 'https://gitee.com/zhonghaiyan/widget-template.git',
  '组件模版': 'https://gitee.com/zhonghaiyan/rollup-template.git'
}
const editpackage = (options) => {
  const filePath = './package.json';
  // 读取 package.json 文件
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading package.json: ${err}`);
      return;
    }
    // 解析 JSON 数据
    const packageJson = JSON.parse(data);

    // 修改 name 字段
    packageJson.name = options.packageName;
    // 将修改后的 JSON 数据写回到文件
    const modifiedContent = JSON.stringify(packageJson, null, 2);

    fs.writeFile(filePath, modifiedContent, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(`Error writing to package.json: ${writeErr}`);
        return;
      }

      console.log('Package name modified successfully.');
    });
  });

}
const initGit = async (options) => {
  return new Promise((resolve) => {
    rimraf.sync(`./${options.packageName}/.git/`)
    process.chdir(`./${options.packageName}`)
    editpackage(options)
    // 执行 Git 命令，初始化仓库
    if (options.gitUrl) {
      exec(`git init`, (addErr, addStdout, addStderr) => {
        if (addErr) {
          console.error(`Error adding files to staging: ${addErr}`);
          return;
        }
        // 执行 Git 命令，将文件夹添加到暂存区
        exec(`git add .`, (addErr, addStdout, addStderr) => {
          if (addErr) {
            console.error(`Error adding files to staging: ${addErr}`);
            return;
          }

          // 执行 Git 命令，提交到本地仓库
          exec('git commit -m "init"', (commitErr, commitStdout, commitStderr) => {
            if (commitErr) {
              console.error(`Error committing files: ${commitErr}`);
              return;
            }

            // 执行 Git 命令，将本地提交推送到远程仓库
            exec(`git remote add origin ${options.gitUrl}`, (pushErr, pushStdout, pushStderr) => {
              if (pushErr) {
                console.error(`Error pushing to remote repository: ${pushErr}`);
                return;
              }
              exec('git push -u origin init', (pushErr, pushStdout, pushStderr) => {
                if (pushErr) {
                  console.error(`Error pushing to remote repository: ${pushErr}`);
                  return;
                }
              })

            });
          });
        });
      }
      )

    }
    resolve()
  })

}
// 执行命令行
const executeCommandLine = async (...args) => {
  return new Promise(resolve => {
    const proc = spawn(...args) // 在node.js中执行shell一般用spawn，实现从主进程的输出流连通到子进程的输出流
    proc.stdout.pipe(process.stdout) // 子进程正常流搭到主进程的正常流
    proc.stderr.pipe(process.stderr) // 子进程错误流插到主进程的错误流
    proc.on('close', () => {
      resolve()
    })
  })
}

export async function createProject(options) {
  // 获取当前路径以及目的路径
  options = {
    ...options,
    targetDirectory: get(
      options,
      "targetDirectory",
      path.resolve(process.cwd(), get(options, "packageName"))
    )
  };
  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname.replace(/^\//, "/"),
    `../.././templates`,
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;
  const taskList = [
    {
      title: "拷贝中",
      task: () => executeCommandLine('git', ['clone', codeWarehouse[options.template], options.packageName], { cwd: `./` })
    },
    {
      title: "安装依赖",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory
        }),
      skip: () =>   // 判断是否使用install命令，跳过install
        !options.runInstall
          ? "Pass --install to automatically install dependencies"
          : undefined
    },
    {
      title: '初始化仓库',
      task: () => initGit(options)
    },

  ]
  const tasks = new Listr(taskList);

  await tasks.run()
  return true;
}