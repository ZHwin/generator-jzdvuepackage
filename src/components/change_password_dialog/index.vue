<template>
  <el-dialog title="修改密码" width="32%" top="30vh" :visible.sync="dialogVisible">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item class="redLable" label="新密码*" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model.trim="form.password" autocomplete="off"></el-input>
      </el-form-item>
     <el-form-item  class="redLable"  label="确认新密码*" prop="password_confirm" :label-width="formLabelWidth">
        <el-input type="password" v-model.trim="form.password_confirm" autocomplete="off"></el-input>
      </el-form-item>
     <el-form-item label="联系方式" :label-width="formLabelWidth" style="color:#000">
        <el-input v-model.trim="form.phoneNumber"  autocomplete="off" ></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer center_row">
      <el-button type="primary" size="mini"  @click="submit">
        <i class="el-icons icon-submit"></i>&nbsp;&nbsp; 提交
      </el-button>
    </div>
  </el-dialog>
</template>
<script src="./change_password_dialog.js"></script>
<style lang="less" src="./change_password_dialog.less" scoped></style>
