<template>
  <div class="center_row">
      <el-button size="mini" @click="detail" type="primary">详情</el-button>
      <el-button size="mini" @click="approval" v-if="sPVisble" type="primary">审批</el-button>
    <el-button size="mini" @click="signing"  v-if="qSVisble" type="primary">签收</el-button>
    <el-button size="mini" @click="feedBack"  v-if="fKVisble" type="primary">反馈</el-button>
  </div>
</template>
<script src="./research_judgment_operat.js"></script>
<style lang="less" src="./research_judgment_operat.less" scoped></style>
