export default  `
importScripts("https://cdn.sheetjs.com/xlsx-0.18.5/package/dist/shim.min.js");
importScripts("https://cdn.sheetjs.com/xlsx-0.18.5/package/dist/xlsx.full.min.js");
onmessage =async  function (evt) {
// await importScripts(evt.data.shimMinUrl);
// await importScripts(evt.data.xlsxFullMinUrl);

    const weakMap = {};
    const symHeaders = Symbol('headers');
    const symwidth = Symbol('width');
    const dataIndex = Symbol('dataIndex');
    weakMap[symHeaders]=[]
    weakMap[symwidth]=[]
    weakMap[dataIndex]=[]
    const workbook = XLSX.utils.book_new();
    evt.data.columns.forEach((i)=>{
        weakMap[symHeaders].push(i?.title||"")
        weakMap[symwidth].push({ wpx: i?.width||100 })
        weakMap[dataIndex].push(i?.dataIndex||i?.key)
    })
    function removeKeysNotInArray(obj, arr) {
        for (let key in obj) {
          if (!arr.includes(key)) {
            delete obj[key];
          }
        }
        return obj
      }
    evt.data.data=evt.data.data.map((i)=>{
         return removeKeysNotInArray(i, weakMap[dataIndex])
    })
   
    console.log(weakMap[symwidth]);
    const worksheet = XLSX.utils.json_to_sheet(evt.data.data);
    // worksheet['!cols'] =weakMap[symwidth]
    XLSX.utils.sheet_add_aoa(worksheet, [weakMap[symHeaders]], { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook,worksheet);

    postMessage({
        workbook
    });

};
`;
