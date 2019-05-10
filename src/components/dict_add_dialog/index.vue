<template>
  <el-dialog :title="title" width="32%" top="30vh" :visible.sync="dialogVisible">
    <el-form ref="form">
      <el-form-item  class="redLable" :label="name=='addSub'||name=='editSub'|| name== 'addSubSub'?'代码*':'字典代码*'" :label-width="formLabelWidth">
        <el-input v-model.trim="dictId" :disabled="dictIdDisabled"></el-input>
      </el-form-item>
      <el-form-item :label="name=='addSub'||name=='editSub'|| name== 'addSubSub'?'代码名称':'字典名称'" :label-width="formLabelWidth">
        <el-input v-model.trim="dictName"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model.trim="remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer center_row">
      <el-button type="primary" size="mini" @click="submit">
        <i class="el-icons icon-submit"></i>&nbsp;&nbsp; 提交
      </el-button>
    </div>
  </el-dialog>
</template>
<script src="./dict_add_dialog.js"></script>
<style lang="less" src="./dict_add_dialog.less" scoped></style>
