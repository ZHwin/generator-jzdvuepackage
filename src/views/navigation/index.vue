<template>
  <div class="navigation-parent">
    <div class="navigation-top">
      <div class="nav-bc">
        <img src="../../assets/img/jinghui.png" alt="智慧禁毒">
        <span class="nav-title">智慧禁毒</span>
      </div>
      <main-header></main-header>
    </div>
    <div class="navigation-middle">
      <div class="middle-content">
        <div class="center_row">
          <el-input style="width:430px;" v-model="searchVal">
            <el-button slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
        </div>
        <div class="content-nav">
          <router-link
            class="linkClass bgCheckBg"
            tag="a"
            target="_blank"
            :to="{name:'BackgroundCheckMian'}"
          >
            <img src="../../assets/img/bgcheck_router.png" style="margin-top:35px;">
            <p style=" font-size: 24px;">背景审查</p>
          </router-link>&nbsp; &nbsp; &nbsp; &nbsp;
          <router-link
            class="linkClass highSocerBg"
            tag="a"
            target="_blank"
            :to="{name:'HighScoreModelManageMain'}"
          >
            <img src="../../assets/img/highsocer_router.png" style="margin-top:35px;">
            <p style=" font-size: 24px;">高危积分模型管理</p>
          </router-link>&nbsp; &nbsp; &nbsp; &nbsp;
          <router-link class="linkClass addrouterBg" tag="a" target="_blank" :to="{name:''}">
            <img src="../../assets/img/add_router.png" style="margin-top:35px;">
            <p style=" font-size: 24px;">后续开发功能</p>
          </router-link>
        </div>
      </div>
      <div class="middle-infobar">
        <div class="infobar bgCheckBg">
          <div class="bartop">背景审查</div>
          <p class="barbottom">{{num}}</p>
        </div>
        <div class="infobar highSocerBg">
          <div class="bartop">高危积分管理</div>
          <p class="barbottom">{{num}}</p>
        </div>
        <div class="infobar pendingItems">
          <div class="bartop">待办消息</div>
          <p class="barbottom" @click="itemsDetail">{{pendingNum}}</p>
        </div>
      </div>
    </div>
    <div class="navigation-bottom">
      <main-footer></main-footer>
    </div>
  </div>
</template>

<script src="./navigation.js"></script>
<style lang="less" src="./navigation.less" scoped></style>
