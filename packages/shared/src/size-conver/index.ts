// 文件大小
export function sizeConver(size: number): string {
  var data = '';
  if (size < 0.1 * 1024) {
    //如果小于0.1KB转化成B
    data = size.toFixed(2) + 'B';
  } else if (size < 0.1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    data = (size / 1024).toFixed(2) + 'KB';
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    data = (size / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    //其他转化成GB
    data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }
  var sizestr = data + '';
  var len = sizestr.indexOf('.');
  var dec = sizestr.substr(len + 1, 2);
  if (dec == '00') {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}
/*
  文件大小
  limit:接口返回的size类型不一致：number、string
*/
export const sizeDataFun = (limit) => {
  var size = '';
  if (typeof limit === 'string' && limit.length > 0) {
    limit = Number(limit);
  }
  if (!(typeof limit === 'number')) {
    return (size = `0B`);
  }
  if (limit < 0.1 * 1024) {
    size = limit.toFixed(2) + 'B';
  } else if (limit < 0.1 * 1024 * 1024) {
    size = (limit / 1024).toFixed(2) + 'KB';
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  var sizeStr = size + '';
  var index = sizeStr.indexOf('.');
  var dou = sizeStr.substr(index + 1, 2);
  if (dou == '00') {
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
};
