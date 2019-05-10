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
              <i class="el-icons icon-reset"></i>&nbsp;&nbsp;&nbsp;重置
            </el-button>
            <el-button type="primary" class="fr btn-blue" @click="submitTask" v-no-repeat-click>
              <i class="el-icons icon-submit"></i>&nbsp;&nbsp;&nbsp;提交
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key red" align="right" :span="3">强戒出所时间</el-col>
        <el-col class="searching-val" :span="5">
          <date-picker
            style="width:80%;"
            v-model="queryTime"
            format="yyyy-MM-dd"
            type="date"
            @on-change="getChooseTime"
          ></date-picker>
        </el-col>
        <el-col class="searching-key red" align="right" :span="3">身份证号*</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="sfzhInpVal"></el-input>
        </el-col>
        <el-col class="searching-key red" align="right" :span="3">任务名称*</el-col>
        <el-col class="searching-val" :span="5">
          <task-name-tree ref="taskName"></task-name-tree>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
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
      </el-row>

      <!-- 从姓名到人员编号的查询项暂时不需要 先注释掉 -->
        <!-- <el-row class="searching-outrow" align="left">
         <el-col class="searching-key" align="right" :span="3">姓名</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model="nameInpVal" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3"></el-col>
        <el-col class="searching-val" :span="5"></el-col>
        <el-col class="searching-key" align="right" :span="3"></el-col>
        <el-col class="searching-val" :span="5"></el-col>
      </el-row> -->
      <!-- <el-row>
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
    </div>
    <!-- 审查通过的提示 -->
    <div class="reviewPassBox" v-show="reviewPassVisible">
      <img class="reviewPassImg" src="../../../assets/img/tongguo.png" alt="审查通过">
      <span>审查通过</span>
    </div>
  </div>
</template>

<script src="./strong_single_review.js"></script>
<style lang="less" src="./strong_single_review.less" scoped></style>
