<template>
  <div>
    <el-button size="mini" class="btn-blue"  @click="updateUser">编辑</el-button>
    <el-button  size="mini" class="btn-red" @click="delUser">删除</el-button>
    <el-button  size="mini" class="btn-green" @click="resetPassword">重置密码</el-button>
  </div>
</template>

<script src="./user_setting_operat.js"></script>
<style lang="less" src="./user_setting_operat.less" scoped></style>
