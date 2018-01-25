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
    var FLAG = '__DW_EMPTY__'
    for(let i in result){
      cssStr = cssStr.replace(i, '__DW_EMPTY__');
      
    }
    cssStr = cssStr.replace(/\}([\s\S]*?)\.__DW_EMPTY__( *)\{([\s\S]*?)\}/g, '}\n');
    cssStr = cssStr.replace(/\}([\s\S]*?)\.__DW_EMPTY__([\s\S]*?)\}/g, function(mastr){
      console.log('mastr', mastr)
    });
    // cssStr = cssStr.replace(/\}([\s\S]*?)\.__DW_EMPTY__( *),( *)\}/g, '}\n');
    //cssStr = cssStr.replace(/\.__DW_EMPTY__( *),( *)/g, '');
    fs.writeFileSync('./result.css', cssStr)
    
  });






}

function parseCssClass(str){
  var obj = clearObj();
  const arr = str.match(/\.[\w\-]+(?:(( *)[\{|\>|\.|,]))/g);
  arr.forEach(k => {
    //k = k.substr(1);
    k = k.match(/[\w\-]+/g);
    obj[k] = true;
  })
  return obj;
}

cleaner('C:/Users/hello/work/Even_web_company/src/dw-lib/common.css', 'C:/Users/hello/work/Even_web_company/src');