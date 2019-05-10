<template>
  <div class="main-outBox">
    <div class="task-top">
      <el-row align="left" style="text-align:left;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title">
            <span class="fl">个人背景审查</span>
            <el-button
              type="primary"
              class="fr btn-purple"
              @click="resetTask($event)"
              v-no-repeat-click
            >
            <i class="el-icons icon-reset"></i>&nbsp;&nbsp;&nbsp;重置</el-button>
            <el-button
              type="primary"
              class="fr btn-blue"
              @click="submitTask"
              v-no-repeat-click
            >
            <i class="el-icons icon-submit"></i>&nbsp;&nbsp;&nbsp;提交</el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <!-- <el-col class="searching-key" align="right" :span="3">姓名</el-col> -->
        <!-- <el-col class="searching-val" :span="5">
          <el-input v-model="nameInpVal" placeholder="请输入内容"></el-input>
        </el-col> -->
        <el-col class="searching-key red" align="right" :span="3">身份证号*</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="sfzhInpVal"></el-input>
        </el-col>
        <el-col class="searching-key red" align="right" :span="3">任务名称*</el-col>
        <el-col class="searching-val" :span="5">
          <task-name-tree ref="taskName" ></task-name-tree>
        </el-col>
         <el-col class="searching-key" align="right" :span="3">审查民警</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szmjInpVal" readonly></el-input>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">审查民警身份证号</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szmjsfzhInpVal" readonly></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">审查民警单位</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szdwInpVal" readonly></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3"></el-col>
        <el-col class="searching-val" :span="5"></el-col>
      </el-row>

      <!-- 这些查询项暂时不需要 所以先注释掉 -->
      <!-- <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">工作单位</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="gzdwInpVal"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">工作部门</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="gzbmInpVal"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">工作岗位</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="gzgwInpVal"></el-input>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">户籍地详址</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="hjdxzInpVal"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">手机号码</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="sjhmInpVal"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">人员编号</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="rybhInpVal"></el-input>
        </el-col>
      </el-row> -->

      <!-- <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">审查民警</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szmjInpVal" readonly></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">审查民警身份证号</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szmjsfzhInpVal" readonly></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">审查民警单位</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="szdwInpVal" readonly></el-input>
        </el-col>
      </el-row> -->

      <el-row
        align="left"
        v-show="gridShow"
        style="text-align:left;margin-top:20px;margin-bottom:0;"
      >
        <el-col :span="24">
          <div class="searching-title searching-title-purple">
            <span class="fl">查询结果列表</span>

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

    <div class="task-content" v-show="gridShow">
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
      <div class="content-bottom" v-show="gridPageShow">
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
    <!-- 审查通过的提示 -->
    <div class="reviewPassBox" v-show="reviewPassVisible">
      <img class="reviewPassImg" src="../../../assets/img/tongguo.png" alt="审查通过">
      <span>审查通过</span>
    </div>
    <!-- 导出EXCEL用的空DIV -->
    <div ref="exportdiv" v-show="false"></div>
  </div>
</template>

<script src="./security_single_review.js"></script>
<style lang="less" src="./security_single_review.less" scoped></style>
