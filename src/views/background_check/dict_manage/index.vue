<template>
  <div class="dict-manage-parent">
    <div class="dict-manage-top">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-blue">字典管理</div>
        </el-col>
      </el-row>
    </div>
    <div class="dict-manage-middle">
      <el-row align="left" style="text-align:left;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title">
            <span class="fl">字典查询</span>
              <el-button type="primary" class="fr btn-purple" icon="el-icons icon-reset" @click="reset">
              重置
            </el-button>
            <el-button type="primary" class="fr btn-blue" icon="el-icon-search" v-no-repeat-click @click="search">查询</el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">字典代码</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model.trim="dictId"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">字典名称</el-col>
        <el-col class="searching-val" :span="5">
          <el-input  v-model.trim="dictName"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">有效性</el-col>
        <el-col class="searching-val" :span="5">
          <el-radio-group v-model="valid">
            <el-radio :label="1">有效</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row align="left" style="text-align:left;margin-top:10px;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title searching-title-purple">
            <span class="fl">查询列表</span>
            <dict-add-dialog ref="adddialog" @RefreshMainDict="RefreshMainDict" @RefreshDetailDict="RefreshDetailDict"></dict-add-dialog>
            <el-button type="primary" class="fr btn-purple" icon="el-icon-plus" @click="addMain">新增</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="dict-manage-content">
      <div class="content-top">
        <div class="content-top-top">
          <ag-grid-vue
            v-loading="agtopLoading"
            style="width:100%;height:100%;"
            class="table ag-theme-balham"
            :gridOptions="gridOptionsTop"
            @cellClicked="cellClicked"
          ></ag-grid-vue>
        </div>
        <div class="content-top-bottom">
          <el-row>
            <el-pagination
             @size-change="mainHandleSizeChange"
            @current-change="mainHandleCurrentChange"
            @prev-click="mainPrevClick"
            @next-click="mainNextClick"
            :current-page.sync="mainCurPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="mainPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mainTotalNum"
            ></el-pagination>
          </el-row>
        </div>
      </div>
      <div class="content-bottom">
        <div class="content-bottom-top">
          <el-row align="left" style="text-align:left;margin-top:0px;margin-bottom:0;">
            <el-col :span="24">
              <div class="searching-title searching-title-green">
                <span class="fl">字典内容列表</span>
                <el-button type="primary" class="fr btn-green" icon="el-icon-plus"  @click="addSub">新增</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="content-bottom-middle">
          <ag-grid-vue
            v-loading="agbottomLoading"
            style="width:100%;height:100%;"
            class="table ag-theme-balham"
            :gridOptions="gridOptionsBootom"
          ></ag-grid-vue>
        </div>
        <div class="content-bottom-bottom">
          <el-row>
            <el-pagination
            @size-change="subHandleSizeChange"
            @current-change="subHandleCurrentChange"
            @prev-click="subPrevClick"
            @next-click="subNextClick"
            :current-page.sync="subCurPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="subPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="subTotalNum"
            ></el-pagination>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./dict_manage.js"></script>
<style lang="less" src="./dict_manage.less" scoped></style>
