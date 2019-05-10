<template>
  <div class="user-setting-parent">
    <div class="user-setting-top">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-blue">用户设置</div>
        </el-col>
      </el-row>
    </div>
    <div class="user-setting-middle">
      <el-row align="left" style="text-align:left;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title">
            <span class="fl">账户查询</span>
            <el-button type="primary" class="fr btn-purple"   @click="reset" icon="el-icons icon-reset">
              重置
            </el-button>
            <el-button
              type="primary"
              class="fr btn-blue"
              icon="el-icon-search"
              v-no-repeat-click
              @click="search"
            >查询</el-button>

          </div>
        </el-col>
      </el-row>

      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">姓名</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model.trim="name"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">警号</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model.trim="policeId"></el-input>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">身份证号</el-col>
        <el-col class="searching-val" :span="5">
          <el-input v-model.trim="idNumber"></el-input>
        </el-col>
      </el-row>
      <el-row class="searching-outrow" align="left">
        <el-col class="searching-key" align="right" :span="3">单位</el-col>
        <el-col class="searching-val" :span="5">
          <public-tree
            ref="unitref"
            :data="unitData"
            type="select"
            :input-width="inputWidth"
            :select-width="selectWidth"
          ></public-tree>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">包含下级单位</el-col>
        <el-col class="searching-val" :span="5" style="overflow-y:hidden;">
          <el-checkbox v-model="isIncludSubUnit"></el-checkbox>
        </el-col>
        <el-col class="searching-key" align="right" :span="3">用户角色</el-col>
        <el-col class="searching-val" :span="5">
          <public-tree
           ref="rolesref"
            :data="rolesData"
            type="select"
            :input-width="inputWidth"
            :select-width="selectWidth"
          ></public-tree>
        </el-col>
      </el-row>

      <el-row align="left" style="text-align:left;margin-top:20px;margin-bottom:0;">
        <el-col :span="24">
          <div class="searching-title searching-title-purple">
            <span class="fl">查询列表</span>
            <user-set-dialog ref="setdialog" @refreshAgGrid="refreshAgGrid"></user-set-dialog>
            <!-- <UserSetDialog ref="setdialog"> </UserSetDialog> -->
            <el-button type="primary" class="fr btn-purple" icon="el-icon-plus" @click="add">新增</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="user-setting-content">
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
            :total="totalNum"
          ></el-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script src="./user_setting.js"></script>
<style lang="less" src="./user_setting.less" scoped></style>
