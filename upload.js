import {noop} from './util';

const bucket = 'static-keep-riding';
const CDN_URL = 'http://v0.api.upyun.com/' + bucket;
const getAuthUrl = '/ypyun_auth/' + bucket;
const staticUrl = 'http://static.keep-riding.com';


function upload(opts){
  const file = opts.file;
  const success = opts.success;
  const stateKey = opts.stateKey;
  const onGetAuthSuccess = opts.onGetAuthSuccess || noop;
  const onProcess = opts.onProcess || noop;
  const self = this;
  var name = file.name;
  var suffix = name.lastIndexOf('.');
  suffix = name.substr(suffix);
  var uploadName = Date.now();
  var filePath = '/' + uploadName + suffix;

  self.request({
    url: getAuthUrl + filePath,
    type: 'put',
    stateKey,
    success(data){
      
      console.log('getAuth OK');
      const xhr = self.request({
        url: CDN_URL + filePath,
        stateKey,
        type: 'put',
        xhrFields: {
          withCredentials: false
        },
        data: file,
        processData: false,
        contentType: false,
        xhr: function(){
          var xhr = new window.XMLHttpRequest();
          //Upload progress
          xhr.upload.addEventListener("progress", function(e){
            onProcess(e.loaded , e.total);
          });
          onGetAuthSuccess(xhr);
          return xhr;
        },
        beforeSend: function(xhr) {

          xhr.setRequestHeader("X-Date", data.date);
          xhr.setRequestHeader("Authorization", data.auth);
        },
        success: function(){
          var url = staticUrl + filePath;
          success(url);
          // var img = document.createElement('img');
          // img.src = url;
          // img.onload = function(){
          //   success({
          //     url,
          //     width: img.naturalWidth || img.width,
          //     height: img.naturalHeight || img.height
          //   })
          // }
        }
      })

    }
    
  })
}

export default upload;