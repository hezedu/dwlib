"use strict";
for(let i in {}){
  throw new Error('dw-global: Object prototype is blur.');
}
Object.setPrototypeOf = function(){
  throw new Error('dw-global: Object.setPrototypeOf is a error');
}

Object.freeze(Object.prototype);

