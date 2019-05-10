
<template>
  <el-dialog
    class="usersetDialog"
    :title="title"
    width="35%"
    top="20vh"
    :visible.sync="dialogVisible"
  >
    <div class="dialog_top">
      <div class="center_row">
        <div class="el-input_lable">用户姓名</div>
        <el-input class="el-input_width" v-model.trim="userName"></el-input>
        <div class="el-input_lable">系统账户</div>
        <el-input class="el-input_width" v-model.trim="sysAccount" v-int></el-input>
      </div>
      <div class="center_row">
        <div class="el-input_lable">警号</div>
        <el-input class="el-input_width" v-model.trim="policeNum" v-int></el-input>
        <div class="el-input_lable">身份证号</div>
        <el-input class="el-input_width" v-model.trim="idNum"></el-input>
      </div>
      <div class="center_row">
        <div class="el-input_lable">职务级别</div>
        <public-tree
          ref="zwjbref"
          :data="zwjbList"
          type="select"
          :input-width="inputWidth"
          :select-width="selectWidth"
           :defult-show="defultShowZw"
        ></public-tree>
        <div style="margin-left:15px;" class="el-input_lable">所属部门</div>
        <public-tree
          ref="bmref"
          :data="unitData"
          type="select"
          :input-width="inputWidth"
          :select-width="selectWidth1"
          :defult-show="defultShowBm"
        ></public-tree>
      </div>
      <div class="center_row">
        <div class="el-input_lable">用户ID&nbsp;</div>
        <el-input class="el-input_width" v-model.trim="userId" v-int></el-input>
        <div class="el-input_lable"></div>
        <div class="el-input_width"></div>
      </div>
      <el-row>
        <p style="color:red;margin-left:100px;line-height:24px;">*密码为身份证号中年+月+日各两位(如810315)</p>
      </el-row>
    </div>
    <div class="dialog_bottom">
        <div v-for="(value,index) in roleMaps" :key="index">
          <h3>{{index+1}}.{{value.title}}</h3>
          <el-checkbox-group v-model="RolesList">
            <el-checkbox  v-for="(v,k) in value.attrs" :key="k" :label="v.code">{{v.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
    </div>

    <div slot="footer" class="dialog-footer center_row">
      <el-button type="primary" size="mini" @click="submit">
        <i class="el-icons icon-submit"></i>&nbsp;&nbsp; 提交
      </el-button>
    </div>
  </el-dialog>
</template>
<script src="./user_set_dialog.js"></script>
<style lang="less" src="./user_set_dialog.less" scoped></style>
