<template>
  <div class="main-outBox">
    <div class="task-top">
      <el-row align="left" style="text-align:left;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title">
            <span class="fl">批量浏览查询</span>
            <el-button
              type="primary"
              class="fr btn-purple"
              @click="resetTask($event)"
              v-no-repeat-click
            >
              <i class="el-icons icon-reset"></i>&nbsp;&nbsp;&nbsp;重置
            </el-button>
            <el-button type="primary" class="fr btn-blue" @click="submitSearch" v-no-repeat-click>
              <i class="el-icons icon-submit"></i>&nbsp;&nbsp;&nbsp;提交
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">审查批次</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="scpcInpVal" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">任务名称</el-col>
        <el-col class="searching-val" :span="5">
          <task-name-tree ref="taskName"></task-name-tree>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">审查时间</el-col>
        <el-col class="searching-val" :span="5">
          <date-picker
            style="width:80%;"
            v-model="dateModel"
            @on-change="getChooseTime"
            :data="queryTime"
            format="yyyy-MM-dd"
            type="daterange"
          ></date-picker>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">审查民警</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="scmjInpVal"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">审查单位</el-col>
        <el-col class="searching-val" :span="5">
          <public-tree
            :data="unitData"
            type="select"
            ref="scdw"
            :input-width="inputWidth"
            :select-width="selectWidth"
          ></public-tree>
        </el-col>
        <el-col class="searching-key red" align="right" :span="3">审查类别</el-col>
        <el-col class="searching-val" :span="5">
          <el-radio v-model="scType" label="01">安保</el-radio>
          <el-radio v-model="scType" label="02">强戒</el-radio>
        </el-col>
      </el-row>

      <el-row
        align="left"
        v-show="gridShow"
        style="text-align:left;margin-top:20px;margin-bottom:0;"
      >
        <el-col :span="24">
          <div class="searching-title searching-title-purple">
            <span class="fl">查询结果列表</span>
            <div ref="exportdiv" v-show="false"></div>
            <el-button
              type="primary"
              class="fr btn-purple"
              icon="el-icon-download"
              @click="onBtExport"
            >导出Excel</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="task-content" v-show="gridShow" v-loading="agLoading">
      <div class="content-top">
        <ag-grid-vue
          v-loading="agLoading"
          style="width:100%;height:100%;"
          class="table ag-theme-balham"
          :gridOptions="gridOptions"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :suppressContextMenu="true"
          @cellDoubleClicked="onCellClicked"
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

<script src="./batch_browsing_query.js"></script>
<style lang="less" src="./batch_browsing_query.less" scoped></style>
