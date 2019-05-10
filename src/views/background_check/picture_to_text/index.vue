<template>
  <div class="nav-outBox">
        <div class="pictureToTextBox">
            <img src="@assets/img/zip-download.png" alt="">
            <span class="pictureToTextBoxSpan">图片识别插件</span>
            <!-- 用来绑定下载图片识别插件的下载按钮 -->
            <el-button class="pictureToTextBtn" type="primary" @click="downloadOCR">下载</el-button>
        </div>
  </div>
</template>

<script src="./picture_to_text.js"></script>
<style lang="css" src="./picture_to_text.css" scoped></style>
