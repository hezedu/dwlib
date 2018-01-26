var fs = require('fs');
var utilPath = require('path');
var sas = require('sas');

function clearObj(){
  var o = {};
  o.__proto__ = null;
  delete(o.__proto__);
  return o;
}




var cleaner = function (cssPath, projectPath){
  cssPath = utilPath.resolve(cssPath);
  projectPath = utilPath.resolve(projectPath);
  var cssStr = fs.readFileSync(cssPath, 'utf-8');
  var cssObj = parseCssClass(cssStr);
  //console.log('cssObj', cssObj);


  
  var pathArr = [];
  function readdir(cb, i) {
    var indexs = i.indexs(), 
    path = utilPath.join(projectPath , indexs.join('/'));
    fs.readdir(path, function(err, files) {
      if (err || !files.length) return cb();
      var tasks = {}, i = 0, len = files.length;
      for (; i < len; i++) {
        tasks[files[i]] = utilPath.join(path , files[i]);
      }
      cb('$reload', tasks);
    });
  }
  
  function stat(path) { //iterator
    return function(cb) {
      fs.lstat(path, function(err, stat) {
        if (err || stat.isSymbolicLink()) return cb();
        if (stat.isDirectory()) {
          return cb('$reload', readdir);
        }
        if(path !== cssPath){
          var suffix = path.lastIndexOf('.');
          suffix = path.substr(suffix + 1);
          //console.log('suffix', suffix)
          if(suffix.toLowerCase() === 'vue'){
            pathArr.push(path);
          }
          
        }
        
        cb();
      });
    }
  }

  
  sas(readdir ,stat, function() {
    var obj = clearObj();
    pathArr.forEach(filePath => {
      obj[filePath] = fs.readFileSync(filePath, 'utf-8');
    })

    var result = clearObj();

    for(let className in cssObj){
      var isHave = false;
      for(let i in obj){
        var file = obj[i];
        if(file.indexOf(className) !== -1){
          isHave = true;
          break;
        }
      }
      if(!isHave){
        result[className] = true;
      }
    }
    console.log('empty total:', Object.keys(result).length);
    var FLAG = '__DW_EMPTY__', REMOVE_FLAG = '__DW_REMOVE_FLAG__';
    for(let i in result){
      //console.log('i', i)
      var reg = new RegExp(i, 'g');
      cssStr = cssStr.replace(reg, '__DW_EMPTY__');
    }
    var count2 = 0;
    cssStr = cssStr.replace(/(^|\})([^\}]*)\.__DW_EMPTY__([\s\S]*?)\{/g, 
      function(mStr){

        var firstP = mStr.indexOf('.');
        var preStr = mStr.substr(0, firstP);
        mStr = mStr.substr(firstP);
      var lastP = mStr.search(/\s*\{$/);
        var afterStr = mStr.substr(lastP);
        //console.log('lastP', lastP, mStr.length - 1, afterStr);
        
        mStr = mStr.substr(0, lastP);
        //console.log('mStr', mStr)
        var mStrArr = mStr.split(',');
        var newClassArr = [];
        mStrArr.forEach(v => {
          if(v.indexOf(FLAG) === -1){
            newClassArr.push(v);
          }
        })
        var resultStr;
        if(!newClassArr.length){
          resultStr = REMOVE_FLAG;
          afterStr = '{';
        }else{
          resultStr = newClassArr.join(',');
        }
        return preStr + resultStr + afterStr;
        // newClassArr = newClassArr.join('.');
        // console.log(newClassArr);
        // count2 = count2 + 1;
        // console.log('******************', count2);
        // return 'GGGG';
    });
    var removeReg = new RegExp(REMOVE_FLAG + '{([\\s\\S]*?)}', 'g')
    cssStr = cssStr.replace(removeReg, function(mStr){
      //console.log('mStr', mStr);
      return ''
    });
    // cssStr = cssStr.replace(/\}([\s\S]*?)\.__DW_EMPTY__([\s\S]*?)\}/g, function(mastr){
    //   console.log('mastr', mastr)
    // });
    // cssStr = cssStr.replace(/\}([\s\S]*?)\.__DW_EMPTY__( *),( *)\}/g, '}\n');
    //cssStr = cssStr.replace(/\.__DW_EMPTY__( *),( *)/g, '');
    fs.writeFileSync('./result.css', cssStr)
    
  });






}

function parseCssClass(str){
  var obj = clearObj();
  const arr = str.match(/\.[\w\-]+(?:(\s*[\{\>\.,\:\[]))/g);
  arr.forEach(k => {
    //k = k.substr(1);
    k = k.match(/[\w\-]+/g);
    obj[k] = true;
  })
  return obj;
}

cleaner('C:/Users/hello/work/Even_web_company/src/dw-lib/common.css', 'C:/Users/hello/work/Even_web_company/src');