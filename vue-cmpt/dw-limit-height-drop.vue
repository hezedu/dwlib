<style>
.dw-limit-height-drop-menu{
  overflow: hidden;
}
</style>
<template>
<div class='dw-limit-height-drop-wrap'>
  <div class='dw-limit-height-drop'>
    <div class='dw-limit-height-drop-button' @click='toggle'>
      <slot></slot>
    </div>
    <div class='dw-limit-height-drop-menu' :style='{height: height, transition: transition}'>
      <div ref="menu" >
        <slot name='menu' />
      </div>
    </div>
  </div>
</div>
</template>

<script>
// v1.0
export default {
  props: {
    limitHeight: { // 设为 0，显示全部
      type: Number,
      default: 70
    },
    duration: {
      type: Number,
      default: 500
    }
  },

  data(){
    var duration = this.duration;
    return {
      height: null,
      transition : 'all ' + (duration / 1000) + 's'
    }
  },
  methods:{
    toggle(){
      const {max, limit} = this.getMenuHeight();
      if(limit === max){
        this.height = max + 'px';
        setTimeout(() => {
          this.height = this.limitHeight + 'px';
        });
      }else{
        this.height = max + 'px';
        setTimeout(() => {
          this.height = 'auto';
        }, this.duration)
      }
    },
    getMenuHeight(){
      var $dom = window.$(this.$refs.menu);
      return {
        limit: $dom.parent().outerHeight(true),
        max: $dom.outerHeight(true)
      }
    }
  },
  mounted(){
    if(this.limitHeight === 0){
      this.show();
    }
  }
}
</script>
