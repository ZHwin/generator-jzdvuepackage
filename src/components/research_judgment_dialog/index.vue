<template>
  <el-dialog :title="title" width="32%" top="30vh" :visible.sync="dialogVisible">
    <el-form v-if="name=='launch'">
      <el-form-item label="接收单位*" class="redLable" :label-width="formLabelWidth">
        <public-tree
          ref="unitref"
          :data="unitData"
          type="select"
          :input-width="inputWidth"
          :select-width="selectWidth"
        ></public-tree>
      </el-form-item>
      <el-form-item label="要求签收时间*" class="redLable"  :label-width="formLabelWidth">
        <date-picker style="width:80%;" @on-change="SingTimeChange"   type="date" format="yyyy-MM-dd"></date-picker>
      </el-form-item>
      <el-form-item label="发起内容*" class="redLable" :label-width="formLabelWidth">
        <el-input style="width:80%;" type="textarea" v-model.trim="singContent" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>

    <el-form v-if="name=='feedBack'">
      <el-form-item label="反馈内容*"   class="redLable" :label-width="formLabelWidth">
        <el-input style="width:80%;" type="textarea" v-model.trim="feedBackContent" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="反馈人" :label-width="formLabelWidth">
        <el-input  style="width:80%;" readonly v-model="fkrxm"></el-input>
      </el-form-item>
      <el-form-item label="反馈人单位" :label-width="formLabelWidth">
       <el-input  style="width:80%;" readonly v-model="fkdw"></el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="name=='approval'">
      <el-form-item label="审批意见*"  class="redLable" :label-width="formLabelWidth">
        <el-input style="width:80%;" type="textarea" v-model.trim="approvalContent" :rows="2" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="审批状态" :label-width="formLabelWidth">
        <el-radio-group v-model="sPStatus">
          <el-radio :label="0">退回</el-radio>
          <el-radio :label="1">通过</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer center_row">
      <el-button type="primary" size="mini" @click="submit">
        <i class="el-icons icon-submit"></i>&nbsp;&nbsp; 提交
      </el-button>
    </div>
  </el-dialog>
</template>
<script src="./research_judgment_dialog.js"></script>
<style lang="less" src="./research_judgment_dialog.less" scoped></style>
