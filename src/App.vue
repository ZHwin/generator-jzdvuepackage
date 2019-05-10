<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  data () {},
  computed: {
    ...mapActions(['allowBack'])
  },
  mounted () {
    window.onpopstate = () => {
      if (!this.allowBack) {
        //    这个allowBack 是存在vuex里面的变量
        history.go(1)
      }
    }
  }
}
</script>

<style>
/* 检索条件的样式 */
.searching-title {
  background-color: #3cafe8;
  color: #ffffff;
  line-height: 45px;
  width: 100%;
  height: 45px;
}
.searching-title-purple {
  background-color: #7a6aef;
}
.searching-title-green {
  background-color: #20b747;
}
.searching-title-darkBlue{
  background-color: #2B84E0;
}
.searching-title-blueGreen{
  background-color: #3DCADE;
}
.searching-title span {
  margin-left: 20px;
  line-height: 45px;
  font-size: 14px;
}
.searching-title .el-button {
  width: auto;
  height: 30px;
  line-height: 30px;
  margin-right: 30px;
  margin-top: 8px;
  font-size: 14px;
  padding: 0 10px;
  border: none;
}
.searching-title .el-button span {
  line-height: 30px;
  margin-left: 0;
}
.searching-outrow {
  text-align: left;
  margin-top: 0;
  margin-bottom: 0;
  height: 31px;
  line-height: 30px;
  border: 1px solid #ccdae5;
  border-top: none;
  border-right: none;
}
.searching-outrowHeigh {
  text-align: left;
  margin-top: 0;
  margin-bottom: 0;
  height: 61px;
  line-height: 60px;
  border: 1px solid #ccdae5;
  border-top: none;
  border-right: none;
}
.searching-key {
  border-right: 1px solid #ccdae5;
  background-color: rgba(60, 175, 232, 0.1);
  padding-right: 10px;
  font-size: 12px;
  line-height: 30px;
  min-height: 30px;
}
.searching-val {
  border-right: 1px solid #ccdae5;
  background-color: #ffffff;
  font-size: 12px;
  /* position: relative; */
  height: 30px;
  word-wrap: break-word;
  overflow-y: auto;
  padding-left: 10px;
  line-height: 30px;
}
.searching-valHigh {
  border-right: 1px solid #ccdae5;
  background-color: #ffffff;
  font-size: 12px;
  position: relative;
  height: 60px;
  word-wrap: break-word;
  overflow-y: auto;
  text-indent: 10px;
}
</style>
