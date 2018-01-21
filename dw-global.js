"use strict";
for(let i in {}){
  throw new Error('dw-global: Object prototype is blur.');
}
Object.setPrototypeOf = function(){
  throw new Error('dw-global: Object.setPrototypeOf is a error');
}

Object.freeze(Object.prototype);

function noop (){}

function clearObj(){
  var o = {};
  o.__proto__ = null;
  delete(o.__proto__);
  return o;
}

function TypeOf(v){
  return Object.prototype.toString.call(v).slice(8, -1);
}

function omitEmpty(obj){
  var obj2 = {};
  for(var i in obj){
    if(obj[i] || obj[i] === 0){
      obj2[i] = obj[i];
    }
  }
  return obj2;
}

module.exports = {
  noop,
  clearObj,
  TypeOf,
  omitEmpty
}