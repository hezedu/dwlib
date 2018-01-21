import request from './request';
import upload from './upload';
import store from '../store';

const API_ROOT = 'http://192.168.56.101:3000/admin_api';
Object.assign(request.globalConfig, {
  rootUrl: API_ROOT,
  stateKey: 'isRequest'
})
var ajaxObj = {
  statusCode: {
    403: function(){
      request.abortAll();
      store.commit('set' , {isLogin: false});
    }
  }
};
if(API_ROOT.indexOf('http') === 0){
  ajaxObj.xhrFields = {
    withCredentials: true
  }
}
window.$.ajaxSetup(ajaxObj);

function vRequest(opts){
  opts.context = this;
  return request(opts);
}
vRequest.abortAll = request.abortAll;
window.Vue.prototype.request = vRequest;

window.Vue.prototype.upload = upload;