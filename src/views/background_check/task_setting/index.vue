<template>
  <div class="task-parent">
    <div class="task-top">
      <el-row align="left" style="text-align:left;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title">
            <span class="fl">任务新增</span>
            <el-button type="primary" class="fr btn-purple" @click="resetTask" v-no-repeat-click> <i class="el-icons icon-reset"></i>&nbsp;&nbsp;&nbsp;重置</el-button>
            <el-button type="primary" class="fr btn-blue"  @click="submitTask" v-no-repeat-click> <i class="el-icons icon-submit"></i>&nbsp;&nbsp;&nbsp;提交</el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key red" align="right" :span="3">任务名称*</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="rwmcInpVal" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">设置民警</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szmjInpVal" readonly></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">设置民警身份证号</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szmjsfzhInpVal" readonly></el-input>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">设置单位</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szdwInpVal" readonly></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3"></el-col>
        <el-col class="searching-val" :span="5"></el-col>
        <el-col class="searching-key" align="right" :span="3"></el-col>
        <el-col class="searching-val" :span="5"></el-col>
      </el-row>

      <el-row align="left" style="text-align:left;margin-top:20px;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title searching-title-purple">
            <span class="fl">涉黑恶线索列表</span>
             <div ref="exportdiv"  v-show="false">
             </div>
            <el-button type="primary" class="fr btn-purple" icon="el-icons icon-excel" @click="onBtExport">导出Excel</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="task-content">
      <div class="content-top">
       <ag-grid-vue
        v-loading="agLoading"
        style="width:100%;height:100%;"
        class="table ag-theme-balham"
        :gridOptions="gridOptions"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :suppressContextMenu="true"
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
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="taskDataTotal"
          ></el-pagination>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script src="./task_setting.js"></script>
<style lang="less" src="./task_setting.less" scoped></style>
