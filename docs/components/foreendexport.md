---
title: foreendexport 导出sdk
nav: 组件
toc: content
group:
  title: JS-SDK
  order: 1
---

# [fore-end-export](https://github.com/zhy15608103017/zhy-dumi.git)

该 sdk 借助了 worker 技术将数据处理部分放入子线程中

<code transform="true" src="./../../demo/foreendexport"></code>

```jsx | pure
// 参数
```

### PV 文件导出

foreendexport

| 参数            | 说明               | 类型   | 默认        | 备注                                                            |
| --------------- | ------------------ | ------ | ----------- | --------------------------------------------------------------- |
| data            | 数据               | Array  | --          |                                                                 |
| columns         | 表头设置,包括宽度, | Array  | --          | 不传会导出 data 中的全部数据，表头以 data 对象中的 key 作为表头 |
| name            | 导出文件名字       | string | 时间戳.xlsx | 默认导出 xlsx                                                   |
| LifeFunction    | 钩子函数           | object |             |                                                                 |
| animationConfig | 钩子函数           | object |             |                                                                 |

#### columns

| 参数  | 说明      | 类型                       | 默认   | 备注                            |
| ----- | --------- | -------------------------- | ------ | ------------------------------- | ------------------------ |
| width | 宽度      | number                     | 100    |                                 |
| title | 表头名字  | string                     | --     | 不传 data 对象中的 key 作为表头 |
| key   | dataIndex | data 对象中对于 key 的名字 | string |                                 | 不传导出时不会导出对于列 |

#### LifeFunction

可关闭自带的动画，借助这里的钩子函数使用自己的动画
| 参数 | 说明 | 类型 | 默认 | 备注 |
| --------------------- | ----------------- | --------- | ----- | ---- |
| create | 创建导出线程的函数 | Function | | |
| dataHandle | 开始处理数据时的函数 | Function | | 可在这里处理数据 loading 效果， |
| fileHandle | 文件开始生成的函数 | Function | | 这里会占用 ul 线程,|
| end | 文件生成完毕的函数 | Function | |文件生成成功,ul 线程释放 |

#### animationConfig

| 参数           | 说明               | 类型    | 默认         | 备注                                                 |
| -------------- | ------------------ | ------- | ------------ | ---------------------------------------------------- |
| dataProcessing | 数据处理动画       | boolean | true         |                                                      |
| filing         | 文件生成动画       | boolean | true         | 建议使用全局动画，且动画中不要使用影响页面回流的属性 |
| filiPromptText | 文件生成动画中文字 | string  | '文件生成中' |                                                      |

## 更新日志

###### 0.0.2 更新内容:

```base
增加文档
```
