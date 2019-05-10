<template>
  <div class="nav-outBox">

    <!-- 导航头部 -->
    <div class="nav-top">
      <div class="nav-bc">
        <img src="../../../assets/img/jinghui.png" alt="背景审查">
        <span class="nav-title">背景审查子系统</span>
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
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icons icon-security"></i>
                <span>安保禁毒审查</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="security-single-review">
                  <i class="el-icons icon-single_check"></i>
                  <span slot="title">单人审查</span>
                  <div class="menu-secu-flag"></div>
                </el-menu-item>
                <el-menu-item index="security-batch-review">
                  <i class="el-icons icon-batch_check"></i>
                  <span slot="title">批量审查</span>
                  <div class="menu-anti-flag"></div>
                </el-menu-item>
                <el-menu-item index="statistical-query">
                  <i class="el-icons icon-search"></i>
                  <span slot="title">统计查询</span>
                  <div class="menu-anti-flag"></div>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icons icon-strong_check"></i>
                <span>强戒出所核查</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="strong-single-review">
                  <i class="el-icons icon-single_check"></i>
                  <span slot="title">单人审查</span>
                  <div class="menu-anti-flag"></div>
                </el-menu-item>
                <el-menu-item index="strong-batch-review">
                  <i class="el-icons icon-batch_check"></i>
                  <span slot="title">批量审查</span>
                  <div class="menu-anti-flag"></div>
                </el-menu-item>
                <el-menu-item index="library-query">
                  <i class="el-icons icon-full_lib_query"></i>
                  <span slot="title">全库查询</span>
                  <div class="menu-anti-flag"></div>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item index="task-setting">
              <div class="menuitemclass">
                <i class="el-icons icon-seting"></i>
                <span slot="title">任务设置</span>
              </div>
            </el-menu-item>
            <el-menu-item index="batch-browsing-query">
              <div class="menuitemclass" style="padding-right:0px;">
                <i class="el-icons icon-people_inquire"></i>
                <span slot="title">批量浏览查询</span>
              </div>
            </el-menu-item>
            <el-menu-item index="picture-to-text">
              <div style="padding-right:18px;color:#303133;">
                <i class="el-icons icon-transform"></i>
                <span slot="title">图片转文字</span>
              </div>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <!-- 主体内容 -->
    <div class="nav-right">
      <div style="position:absolute;top:0;left:0;right:0;bottom:60px;padding:20px;">
        <keep-alive :include="['PictureToText', 'TaskSetting']">
          <router-view></router-view>
        </keep-alive>
      </div>
      <!-- 导航尾部 頁尾 -->
      <main-footer></main-footer>
    </div>
  </div>
</template>

<script src="./background_check_mian.js"></script>
<style lang="less" src="./background_check_mian.less" scoped></style>
