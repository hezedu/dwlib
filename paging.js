export default function(max, len, index){
  len = len || 9;
  index = index || 1;

  var pre_ellipsis = null; //前省略
  var next_ellipsis = null;//后省略
  var end = len;
  var start = 2;

  if(max <= len){
    end = max
  }else if(index < (len - 1)){
    next_ellipsis = true
    end = end - 1;
  }else if((max - index) < (len - 2)){
    start = max - len + 3;
    end  = max;
    pre_ellipsis = true;
  }else{
    var preLen = Math.floor(len / 2);
    next_ellipsis = pre_ellipsis = true;
    start = index - preLen + 2;
    end = start + len - 4;
  }

  return {
    prev: (index === 1) ? null : index - 1,
    prevEllipsis: pre_ellipsis ? (start - 1) : pre_ellipsis,
    midStart: start,
    midEnd: end,
    nextEllipsis: next_ellipsis ? end : next_ellipsis,
    index: index,
    first: 1,
    max:1 === max ? null : max,
    next: index === max ? null : (index + 1)
  }
}