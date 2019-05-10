<template>
  <div class="nav-userinfo">
    <div style="margin-left:25px;">
  用户:
      <span>{{this.$store.state.userName}}</span>
      &nbsp;&nbsp;&nbsp;
      单位:
      <span>{{this.$store.state.jgmc}}</span>
      &nbsp;&nbsp;&nbsp;
      用户类型:
      <span>{{this.$store.state.roleName}}</span>
    </div>
    <div style="margin-right:25px;">
      <change-password-dialog ref="dialogref"></change-password-dialog>
      <span style="cursor:pointer" @click="backHome">
        <i class="el-icons icon-home"></i>返回首页
      </span>
      &nbsp;&nbsp;&nbsp;
      <span style="cursor:pointer" @click="changePassword">
        <i class="el-icons icon-change_password"></i>修改密码
      </span>
      &nbsp; &nbsp; &nbsp;
      <span style="cursor:pointer" @click="dictManage">
        <i class="el-icons icon-dict_manage"></i>字典管理
      </span>
      &nbsp; &nbsp; &nbsp;
      <span style="cursor:pointer" @click="userSetting">
        <i class="el-icons icon-user_set"></i>用户设置
      </span>
      &nbsp; &nbsp; &nbsp;
      <span @click="logout" style="cursor:pointer">
        <i class="el-icons icon-logout"></i>退出登录
      </span>
        &nbsp;
       &nbsp;
      <span @click="fullTogle">
        <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />
     </span>

    </div>
  </div>
</template>
<script src="./main_header.js"></script>
<style lang="less" src="./main_header.less" scoped></style>
