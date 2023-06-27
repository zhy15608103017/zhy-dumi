/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as XLSX from 'xlsx';

import { Spin } from '../utils/Spin.js';
import './../utils/index.css';
import './../utils/nprogress.css';
import NProgress from './../utils/nprogress.js';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
  promptText = '文件生成中',
  LifeFunction = {
    create: () => {},
    dataHandle: () => {},
    fileHandle: () => {},
    end: () => {},
  },
) => {
  exportStatus = 'start';
  const worker = new Worker(scriptURL);
  if (isFunction(LifeFunction.create)) LifeFunction.create();
  function startWorker() {
    requestAnimationFrame(() => NProgress.start());
    exportStatus = 'dataProcessing';
    if (isFunction(LifeFunction.dataHandle)) LifeFunction.dataHandle();
    worker.postMessage({ columns, data });
  }
  startWorker();
  worker.onmessage = async (event) => {
    requestAnimationFrame(() => NProgress.done());
    let spin = new Spin(promptText);
    spin.start();
    exportStatus = 'filing';
    if (isFunction(LifeFunction.fileHandle)) LifeFunction.fileHandle();
    requestIdleCallback(() => {
      XLSX.writeFile(event.data.workbook, flieName);
      spin.end();
      exportStatus = 'end';
      if (isFunction(LifeFunction.end)) LifeFunction.end();
    });
  };
  return;
};
