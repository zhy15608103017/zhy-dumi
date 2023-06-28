/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as XLSX from 'xlsx';

import './../utils/index.css';
import './../utils/nprogress.css';
import NProgress from './../utils/nprogress.js';
import { Spin } from './../utils/Spin.js';

import { isFunction } from '../utils/index.js';
import scriptContent from './worker/worker.js';

interface Columns {
  width?: number;
  title?: string;
  dataIndex?: string;
}

const scriptBlob = new Blob([scriptContent], {
  type: 'application/javascript',
});
const scriptURL = URL.createObjectURL(scriptBlob);
let exportStatus = 'init';
export function getExportStatus() {
  return exportStatus;
}

export const exportFn = (
  data: any[],
  columns: Columns[],
  flieName = `${Date.now()}.xlsx`,
  LifeFunction = {
    create: () => {},
    dataHandle: () => {},
    fileHandle: () => {},
    end: () => {},
  },
  animationConfig = {
    dataProcessing: true,
    filing: true,
    filiPromptText: '文件生成中',
  },
) => {
  const {
    dataProcessing = true,
    filing = true,
    filiPromptText = '文件生成中',
  } = animationConfig;
  exportStatus = 'start';
  const worker = new Worker(scriptURL);
  if (isFunction(LifeFunction.create)) LifeFunction.create();
  function startWorker() {
    dataProcessing && requestAnimationFrame(() => NProgress.start());
    exportStatus = 'dataProcessing';
    if (isFunction(LifeFunction.dataHandle)) LifeFunction.dataHandle();
    worker.postMessage({ columns, data });
  }

  startWorker();
  worker.onmessage = async (event) => {
    dataProcessing && requestAnimationFrame(() => NProgress.done());
    const spin = new Spin(filiPromptText);

    filing && spin.start();

    exportStatus = 'filing';
    if (isFunction(LifeFunction.fileHandle)) LifeFunction.fileHandle();
    requestIdleCallback(() => {
      XLSX.writeFile(event.data.workbook, flieName);
      filing && spin.end();

      exportStatus = 'end';
      if (isFunction(LifeFunction.end)) LifeFunction.end();
    });
  };
  return;
};
