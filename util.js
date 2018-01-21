export const noop = function(){}

export const TypeOf = function(v){
  return Object.prototype.toString.call(v).slice(8, -1);
}

export function clearObj(){
  var o = {};
  o.__proto__ = null;
  delete(o.__proto__);
  return o;
}

export function omitEmpty(obj){
  var obj2 = {};
  for(var i in obj){
    if(obj[i] || obj[i] === 0){
      obj2[i] = obj[i];
    }
  }
  return obj2;
}

export const timeFormat = (date, fmt) => {
  date = date ? new Date(date) : new Date();
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}
export const ONE_SEC = 1000;
export const ONE_MIN = ONE_SEC * 60;

export const wellSize = (size, fix) => {
  let m = 'B';
  fix = fix || 2;
  if(size > 1024){
    size = (size / 1024);
    m = 'K';
  }

  if(size > 1024){
    size = (size / 1024);
    m = 'M';
  }
  if(size > 1024){
    size = (size / 1024);
    m = 'G';
  }
  return size.toFixed(fix) + m;
}
