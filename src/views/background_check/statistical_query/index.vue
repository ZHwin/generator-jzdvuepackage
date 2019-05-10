<template>
 <div class="statistical-parent">
    <div class="statistical-top">
      <el-row align="left" style="text-align:left;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title">
            <span class="fl">统计查询</span>
            <el-button type="primary" class="fr btn-purple" @click="resetTask($event)">
              <i class="el-icons icon-reset"></i>&nbsp;&nbsp;&nbsp;重置
            </el-button>
            <el-button type="primary" class="fr btn-blue" @click="submitstatistical" v-no-repeat-click>
              <i class="el-icons icon-submit"></i>&nbsp;&nbsp;&nbsp;统计
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">统计时间</el-col>
        <el-col class="searching-val" :span="5">
          <date-picker style="width:80%;" v-model="dateModel" @on-change="getChooseTime" :data="queryTime" format="yyyy-MM-dd" type="daterange"></date-picker>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">任务名称</el-col>
        <el-col class="searching-val" :span="5">
          <task-name-tree ref="taskName"></task-name-tree>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">
          <!-- 暂时不需要统计单位这个查询项 所以注释掉 -->
          <!-- 统计单位 -->
          </el-col>
        <el-col class="searching-val" :span="5">
          <!-- <public-tree
          ref="queryUnit"
          :data="queryUnit"
          type="select"
          :input-width="inputWidth"
          :select-width="selectWidth"
        ></public-tree> -->
        </el-col>
      </el-row>

      <el-row align="left" v-show="gridShow" style="text-align:left;margin-top:20px;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title searching-title-purple">
            <span class="fl">统计结果列表</span>
            <el-button type="primary" class="fr btn-purple" icon="el-icon-download" @click="onBtExport">导出Excel</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="statistical-content">
      <div class="content-top">
       <ag-grid-vue
        v-loading="agLoading"
        style="width:100%;height:100%;"
        class="table ag-theme-balham"
        :gridOptions="gridOptions"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :suppressContextMenu="true"
        v-show="gridShow"
        @cellDoubleClicked="onCellClicked"
      ></ag-grid-vue>
      </div>
      <div class="content-bottom"></div>
    </div>

  </div>
</template>

<script src="./statistical_query.js"></script>
<style lang="less" src="./statistical_query.less" scoped></style>
