/* eslint-disable no-underscore-dangle */
const path = require('path');
const express = require('express');
const fs = require('fs-extra');
const ejs = require('ejs');
const app = express();
const fileList = []; // 组件 package.json 地址集合
let packageDependencies = [];
let packagesName = []; // 包名集合
let dependenciesName = []; // 依赖的包名集合
let packHtml = ''; // 版本表格 html
// echarts 配置信息
let echartsOptions = {
    tooltip:{},
    visualMap: {
        type: 'continuous',
        min: 0,
        max: 10,
        inRange: {
            color: ['#2F93C8', '#AEC48F', '#FFDB5C', '#F98862']
        }
    },
    series: {
        type: 'sunburst',
        data: [],
        radius: [0, '90%'],
        label: {
            rotate: 'radial'
        },
    }
};
// 组件名前缀(用于区分jsuda自己的组件)
const packPrefix = '@zhy-dumi/';

async function getPackageData() {
    const packagePath = path.join(__dirname, 'packages')
    await fileDisplay(packagePath);
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 * @param recursion 是否需要继续递归下去 默认为true
 */
async function fileDisplay(filePath, recursion = true) {
    const files = fs.readdirSync(filePath);
    //遍历读取到的文件列表
    files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        const stats = fs.statSync(filedir);
        var isFile = stats.isFile();//是否是文件
        var isDir = stats.isDirectory();//是否是文件夹
        if (isFile) {
            if (filedir.endsWith('package.json')) {
                getFileList(filedir);
            }
        }
        if (isDir && recursion) {
            fileDisplay(filedir, false);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
}

async function getFileList(filedir) {
    const data = filedir.split('/');
    const packageName = data.slice(-2)[0];
    // 储存包名和 package.json 的地址
    fileList.push({
        name: packageName,
        path: filedir
    });
}

async function getDependencies() {
    for (let i = 0; i < fileList.length; i++) {
        const element = fileList[i];
        const packageData = fs.readFileSync(element.path, 'utf8')
        const params = JSON.parse(packageData);
        const npms = { ...params.dependencies, ...params.devDependencies }
        for (let key in npms) {
            if (!key.includes(packPrefix)) {
                delete npms[key];
            }
        }
        packageDependencies.push({
            name: element.name,
            dependencies: npms,
            version: params.version
        });
        packagesName.push(element.name);
        for (key in npms) {
            dependenciesName.push({
                name: element.name,
                dependencies: key.replace('@jusda-tools/', '')
            })
        }
    }
}

async function getTableHtml() {
    for (let i = 0; i < packageDependencies.length; i++) {
        const pack = packageDependencies[i];
        packHtml += '<tr><td>' + pack.name + '</td><td>' + pack.version + '</td></tr>';
    }
}


async function getEchartsOptions() {
    let rootNode = [];
    let data = [];
    packageDependencies.map(item => {
        if (!item.dependencies || JSON.stringify(item.dependencies) === '{}') {
            rootNode.push({
                name: item.name.replace('@jusda-tools/', ''),
                version: item.version
            });
        }
    })
    rootNode.map(item => {
        data.push({
            name: item.name,
            value: 1,
            children: []
        });
    });
    data.map(item => {
        getChildren(item);
    })
    data.map(item => {
        delValue(item);
    })
    echartsOptions.series.data = data;

}

function delValue(element) {
    const { children } = element;
    if (children && children.length > 0) {
        delete element.value;
        children.map(item => {
            delValue(item);
        })
    }
    if(children && children.length === 0){
        delete element.children;
    }
}

function getChildren(element) {
    let children = [];
    let parent = [];
    // 该组件有被依赖
    let dependenciesArray = [];
    dependenciesName.map(item => {
        dependenciesArray.push(item.dependencies);
    })
    if (dependenciesArray.includes(element.name)) {
        dependenciesName.map(item => {
            if (item.dependencies === element.name && !parent.includes(item.name)) {
                parent.push(item.name);
            }
        })
    }
    parent.map(item => {
        children.push({
            name: item,
            value: 1,
            children: []
        })
    });
    element.children = children;
    element.children.map(item => {
        getChildren(item);
    })
}


async function main() {
    // 在 app 文件夹开启静态服务
    // app.use(express.static('views'));
    app.set('views', path.join(__dirname, 'views'));
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    // 获取组件名和package.json 的对应数据
    await getPackageData();
    // 获取组件及其依赖的组件关系(只包含jusda自己的组件)
    await getDependencies();
    // 绘制包版本的html表格
    await getTableHtml();
    // 获取echarts的配置信息
    // await getEchartsOptions();
    app.get('/', function (req, res) {
        res.render('index', { packHtml: encodeURIComponent(packHtml), echartsOptions: encodeURIComponent(JSON.stringify(echartsOptions)) });
    });
    // app.get('/echarts.min.js', function (req, res) {
    //     res.sendFile(path.join(__dirname, 'views') + "/" + "echarts.min.js");
    // });
    app.get('/index.css', function (req, res) {
        res.sendFile(path.join(__dirname, 'views') + "/" + "index.css");
    });
    app.listen(8080, () => {
        console.log('Demo server listening on port 8080');
    });
}

main();