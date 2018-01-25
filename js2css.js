var style = {
  _a: {
    color: 'green',
    _b: {
      color: 'blue',
      _c: {
        color: 'red',
        _d : {
          color: 'black',
          $a: {
            color: '#fff'
          }
        }
      }
    }
  }
}

/*
严禁包含父级
var s = require('style')
<div class = 'a'>
  <div class='b'>
    <div class='a'>
    
    </div>
  </div>
</div>
*/