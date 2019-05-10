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

    <!-- 左侧导航 -->
    <div class="nav-left">
      <el-row>
        <el-col :span="24">
          <el-menu
            :default-active="defaultRoute"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            router="true"
            unique-opened="true"
            collapse-transition="true"
          >
            <el-menu-item index="score-model-home-page">
              <div class="menuitemclass">
                <i class="el-icons icon-overview"></i>
                <span slot="title">概览</span>
              </div>
            </el-menu-item>
            <el-menu-item index="score-model-inquire">
              <div class="menuitemclass">
                <i class="el-icons icon-search"></i>
                <span slot="title">查询</span>
              </div>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <!-- 主体内容 -->
    <div class="nav-right">
      <div
        style="position:absolute;top:0;left:0;right:0;bottom:60px;padding:20px;padding-bottom:0;"
      >
       <keep-alive :include="['ScoreModelHomePage']">
        <router-view></router-view>
       </keep-alive>
      </div>
      <!-- 导航尾部 頁尾 -->
      <main-footer></main-footer>
    </div>
  </div>
</template>

<script src="./high_score_model_manage_main.js"></script>
<style lang="less" src="./high_score_model_manage_main.less" scoped></style>
