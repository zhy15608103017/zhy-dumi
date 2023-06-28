/* eslint-disable react/button-has-type */

import foreendexport from '@zhy-dumi/fore-end-export';
import React from 'react';
const App = () => {
  const y = 1000;
  const x = 20;

  const keys = new Array(x).fill(0).map((e, i) => {
    return ['名字' + i, '胡彦斌' + i + Date.now()];
  });
  const Arr = new Array(y).fill(Object.fromEntries(keys));

  const columns1 = new Array(x).fill(0).map((e, i) => {
    return {
      title: '名字' + i,
      width: 2000,
      key: '名字' + i,
    };
  });

  return (
    <button
      onClick={() => {
        foreendexport(
          Arr,
          columns1,
          '导出文件.xlsx',
          {
            create: () => {
              console.log(111);
            },
          },
          {
            dataProcessing: false,
            filing: false,
            filiPromptText: '文件生成中',
          },
        );
      }}
    >
      导出文件
    </button>
  );
};
export default App;
