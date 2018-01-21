const {noop, TypeOf, omitEmpty} = require('./dw-global');

const $ = window.$;
const POOL = {};
var poolIndex = 0;

// 默认的http处理程序
function httpErrorHandler(xhr){
  if(!xhr) return;
  console.error(`http ${xhr.status} ${xhr.responseText}`);
}
//过滤掉空的参数
const omitKeyMap = {
  stateKey: true,
  repeatSubmitMode: true,
  isOmitEmptyData: true,
  complete: true,
  success: true,
  error: true,
  rootUrl: true
};

const globalConfig = {
  isOmitEmptyData: true,
  repeatSubmitMode: undefined,
  rootUrl: ''
}

function request(opts){
  var {
    stateKey,
    success = noop,
    complete = noop,
    error = httpErrorHandler,
    isOmitEmptyData = globalConfig.isOmitEmptyData,
    repeatSubmitMode = globalConfig.repeatSubmitMode,
    rootUrl = globalConfig.rootUrl,
    url
  } = opts;
  // const stateKey = opts.stateKey;
  // const success = opts.success || noop;
  // const complete = opts.complete || noop;
  // const error = opts.error || httpErrorHandler;
  // const isOmitEmptyData = 
  //   opts.isOmitEmptyData === undefined 
  //   ? globalConfig.isOmitEmptyData
  //   : opts.isOmitEmptyData;

  // var repeatSubmitMode = 
  //   opts.repeatSubmitMode === undefined 
  //   ? globalConfig.repeatSubmitMode 
  //   : opts.repeatSubmitMode;

  Object.keys(opts).forEach(k => {
    if(omitKeyMap[k]){
      delete(opts[k]);
    }
  });
  const self = opts.context;
  opts.type = opts.type || 'get';
  
  if(url.indexOf('http') !== 0){
    opts.url =  rootUrl + url;
  }

  if(isOmitEmptyData){
    if(TypeOf(opts.data) === 'Object'){
      opts.data = omitEmpty(opts.data);
    }
  }

  var _pIndex = poolIndex;
  
  var selfPoolIndex;
  
  if(stateKey){
    selfPoolIndex = '_request_pool_index_' + stateKey;
    if(repeatSubmitMode === undefined){
      if(opts.type === 'get'){
        repeatSubmitMode = 'abort';
      }else{
        repeatSubmitMode = 'block';
      }
    }

    if(repeatSubmitMode === 'abort'){
      const index = self[selfPoolIndex];
      if(POOL[index]){
        POOL[index].abort(); //波浪模式
      }
    }

    if(self[stateKey]){
      if(repeatSubmitMode === 'abort'){

      }else if(repeatSubmitMode === 'block'){
        return; //阻塞模式
      }
    }else {
      self[stateKey] = true;
    }
  }



  
  //由于juqery的complete会在success之后执行，所以自已写了个让它在之前执行。
  opts.complete = function(xhr, status){

    delete(POOL[_pIndex]);
    
    if(stateKey){
      self[stateKey] = false;
      // if(_pIndex !== self[selfPoolIndex]){
      //   console.log('=============重载阻止=============');
      //   return;
      // }
    }

    if(status === 'abort'){ //取消不进行操作
      //console.log('=============abort 成功!=============');
      return;
    }

    complete(xhr, status);

    if(status !== 'success'){
      error(xhr);
    }else{
      success((xhr.responseJSON || xhr.responseText));
    }
  }


  var xhr = $.ajax(opts);
  POOL[_pIndex] = xhr;
  poolIndex = poolIndex + 1;

  if(selfPoolIndex) {
    self[selfPoolIndex] = _pIndex;
  }
  return xhr;
}

request.abortAll = function(){
  Object.keys(POOL).forEach(k => {
    POOL[k].abort();
  })
}

request.globalConfig = globalConfig


export default  request;