<template>
  <div class="nav-outBox">
    <!-- 导航头部 -->
    <div class="nav-top">
      <div class="nav-bc">
        <img src="../../../assets/img/jinghui.png" alt="背景审查">
        <span class="nav-title">高危积分模型管理系统</span>
      </div>
      <main-header></main-header>
    </div>

    <!-- 主体内容 -->
    <div class="nav-right">
     <div class="main-outBox">
          <div class="task-top">
            <el-row align="left" style="text-align:left;margin-bottom:0;">
              <el-col :span="24">
                <div class="searching-title searching-title-darkBlue">
                  <span class="fl">待办查询</span>

                  <el-button
                    type="primary"
                    class="fr btn-blue"
                    @click="submitTask"
                    v-no-repeat-click
                  >
                    <i class="el-icons icon-search"></i>&nbsp;&nbsp;&nbsp;查询
                  </el-button>
                </div>
              </el-col>
            </el-row>

            <el-row class="searching-outrow" align="left">
              <el-col class="searching-key" align="right" :span="3">消息标题</el-col>
              <el-col class="searching-val" :span="5">
                <el-input v-model="xxbtInpVal"></el-input>
              </el-col>
              <el-col class="searching-key" align="right" :span="3">消息处理状态</el-col>
              <el-col class="searching-val" :span="5">
                <el-radio v-model="xxclztVal" label="0">未处理</el-radio>
                <el-radio v-model="xxclztVal" label="1">已处理</el-radio>
              </el-col>
              <el-col class="searching-key" align="right" :span="3">发送单位</el-col>
              <el-col class="searching-val" :span="5">
                        <public-tree
                    :data="unitData"
                    type="select"
                    ref="scdw"
                    :input-width="inputWidth"
                    :select-width="selectWidth"
                ></public-tree>
              </el-col>
            </el-row>

            <el-row class="searching-outrow" align="left">
              <el-col class="searching-key" align="right" :span="3">发送时间</el-col>
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
              <el-col class="searching-key" align="right" :span="3"></el-col>
              <el-col class="searching-val" :span="5"></el-col>
               <el-col class="searching-key" align="right" :span="3"></el-col>
              <el-col class="searching-val" :span="5"></el-col>
            </el-row>

            <el-row
              align="left"
              style="text-align:left;margin-top:20px;margin-bottom:0;"
            >
              <el-col :span="24">
                <div class="searching-title searching-title-blueGreen">
                  <span class="fl">查询结果</span>

                  <!-- <el-button
                    type="primary"
                    class="fr btn-purple"
                    icon="el-icon-download"
                    @click="onBtExport"
                  >导出Excel</el-button> -->
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="task-content">
            <div class="content-top">
              <ag-grid-vue
                @data='getinputdata'
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
          <!-- 导出EXCEL用的空DIV -->
          <div ref="exportdiv" v-show="false"></div>
        </div>

      <!-- 导航尾部 頁尾 -->
      <main-footer></main-footer>
    </div>
  </div>
</template>

<script src="./items_detail.js"></script>
<style lang="less" src="./items_detail.less" scoped></style>
