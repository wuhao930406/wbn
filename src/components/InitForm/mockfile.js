export default function mockfile(datalist) {
  
  let newdatalist = datalist.map((item, i) => {
    return {
      uid: item.id ? item.id : i+1,
      name: `文件${i+1}`,
      status: 'done',
      url: item?.preview_url,
      response:{
        data:item
      }
    };
  });
  console.log(newdatalist)
  return {
    fileList: newdatalist,
  };
}
