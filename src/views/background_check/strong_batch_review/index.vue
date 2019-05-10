<template >
  <div>
    <div class="strong-batch-parent">
      <div class="strong-batch-top" v-loading="loading">
        <el-row align="left" style="text-align:left;margin-bottom:0;">
          <el-col :span="24">
            <div class="searching-title">
              <span class="fl">批量查询</span>
              <el-button type="primary" class="fr btn-purple" @click="reset" >
                <i class="el-icons icon-reset"></i>&nbsp;&nbsp;&nbsp;重置
              </el-button>
              <el-button type="primary" class="fr btn-blue" v-no-repeat-click @click="submit">
                <i class="el-icons icon-submit"></i>&nbsp;&nbsp;&nbsp;提交
              </el-button>
            </div>
          </el-col>
        </el-row>

        <el-row class="searching-outrow" align="left" style="height:64px">
          <el-col class="searching-key" align="right" :span="3" style="line-height:64px">上传说明</el-col>
          <el-col class="searching-val row_center" :span="21">
            <div>
              <p>1.身份证为须填项，请填写<span class="red">18</span>位身份证号</p>
              <p>2.每次导入人员不得大于<span class="red">10000</span>人，大于<span class="red">10000</span>人请分批导入</p>
            </div>
            <div style="margin-left:120px">
             <strong> 背审对象数据导入表</strong>
              <el-button  style="margin-left:10px" size="mini" @click="downloadTemplate" type="danger">下载</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="searching-outrow" align="left" style="height:64px">
          <el-col class="searching-key" align="right" :span="3" style="line-height:64px">上传附件</el-col>
          <el-col class="searching-val row_center" id="upload" :span="21">
            <el-upload
              ref="elupload"
              action
              :auto-upload="false"
              :on-change="fileChange"
              :on-remove="fileRemove"
              :before-upload="beforeUpload"
              :limit="1"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
              <el-button size="mini" type="primary" @click="uploadFile">上传附件</el-button>
            </el-upload>
          </el-col>
        </el-row>

        <el-row class="searching-outrow" align="left">
          <el-col class="searching-key red" align="right" :span="3">任务名称*</el-col>
          <el-col class="searching-val" :span="5" style="border-right:0">
            <task-name-tree ref="taskName" ></task-name-tree>
          </el-col>
          <el-col class="searching-val" :span="16"></el-col>
        </el-row>

        <el-row class="searching-outrow" align="left">
          <el-col class="searching-key" align="right" :span="3">审查民警</el-col>
          <el-col class="searching-val" :span="5">
            <el-input v-model="policeName" readonly></el-input>
          </el-col>
          <el-col class="searching-key" align="right" :span="3">审查民警身份证号</el-col>
          <el-col class="searching-val" :span="5">
            <el-input v-model="policeId" readonly></el-input>
          </el-col>
          <el-col class="searching-key" align="right" :span="3">审查民警单位</el-col>
          <el-col class="searching-val" :span="5">
            <el-input v-model="policeUnit" readonly></el-input>
          </el-col>
        </el-row>
      </div>

      <div class="strong-batch-content">
        <div class="content-top">
          <ag-grid-vue
            v-loading="agLoading"
            style="width:100%;height:100%;"
            class="table ag-theme-balham"
            :gridOptions="gridOptions"
          ></ag-grid-vue>
        </div>
        <div class="content-bottom">
          <!-- 分页 -->
          <el-row>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="prevClick"
            @next-click="nextClick"
            :current-page.sync="curPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum"></el-pagination>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./strong_batch_review.js"></script>
<style lang="less" src="./strong_batch_review.less" scoped></style>
