<template>
  <div class="statistical-detail-parent">
    <div class="statistical-detail-main">
      <el-row align="left" style="text-align:left;margin-top:20px;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title searching-title-purple">
            <span class="fl">统计结果详情列表</span>
            <el-button
              type="primary"
              class="fr btn-purple"
              icon="el-icon-download"
              @click="onBtExport"
            >导出Excel</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="grid-box">
        <ag-grid-vue
          v-loading="agLoading"
          style="width:100%;height:100%;"
          class="table ag-theme-balham"
          :gridOptions="gridOptions"
          :suppressContextMenu="true"
        ></ag-grid-vue>
      </div>

      <!-- 分页 -->
      <div class="page-box">
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

    <!-- 导航尾部 頁尾 -->
    <div class="nav-bottom">
      <div id="publicBottomImg"></div>
    </div>
    <!-- 导出EXCEL用的空DIV -->
    <div ref="exportdiv"></div>
  </div>
</template>

<script src="./statistical_query_detail.js"></script>
<style lang="less" src="./statistical_query_detail.less" scoped></style>
