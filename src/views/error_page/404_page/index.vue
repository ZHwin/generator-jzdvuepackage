<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/img/404.png" alt="404">
        <img class="pic-404__child left" src="@/assets/img/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="@/assets/img/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="@/assets/img/404_cloud.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回或者发送错误报告</div>
        <router-link to="/" class="bullshit__return-home">返回首页</router-link>

        <el-button class="bullshit__return" @click="Back">返回上层</el-button>
      </div>
    </div>
  </div>
</template>
<script src="./404_page.js"></script>
<style lang="less" src="./404_page.less" scoped></style>
