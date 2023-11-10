import arg from "arg";
import get from "lodash/get";
// 解析命令行参数 rawArgs即 process.argv
export default function (rawArgs) {

  // 自定义接收命令行参数
  const args = arg(
    {
      "--git": Boolean,
      "--install": Boolean,
      "--version": Boolean,
      "--help": Boolean,
      "-h": "--help",
      "-i": "--install",
      "-v": "--version",
    },
    {
      // process.argv除了前两个，其余的元素才是额外的命令行参数
      argv: rawArgs.slice(2), 
    }
  );
  return {
    help: get(args, "--help", false),   // 帮助命令
    version : get(args, "--version", false),   // 获取当前版本
    template: args._[0],
    runInstall: get(args, "--install", false),  // 拷贝后自动安装依赖 
  };
}