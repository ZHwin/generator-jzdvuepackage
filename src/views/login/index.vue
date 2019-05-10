<template>
  <div id="parent">
    <div class="login_outbox">
      <div id="logo">
        <h1 class="hogo">
          <i>智慧禁毒</i>
        </h1>
      </div>
      <section class="stark-login">
        <el-form
          ref="loginform"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div id="fade-box">
            <el-form-item prop="username">
              <el-input
                ref="usernameref"
               autofocus
                class="loginUser"
                v-model.trim="loginForm.username"
                name="username"
                placeholder="请输入用户名"
                type="text"
                auto-complete="on"
              ></el-input>
              <!-- </div> -->
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                ref="passwordref"
                class="loginUser"
                placeholder="请输入密码"
                v-model.trim="loginForm.password"
                :type="passwordType"
                name="password"
                auto-complete="on"
              >
                <span @click="showPwd" slot="suffix">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"></svg-icon>
                </span>
              </el-input>
            </el-form-item>
            <div class="center_row">
              <el-button
               ref="loginref"
                v-no-repeat-click
                type="primary"
                style="margin-bottom:30px;"
                :loading="loginLoading1"
                @click.native.prevent="handleSubmit"
                :disabled="loginLoading2"
              >{{loginTxt}}</el-button>
              <el-button
                v-no-repeat-click
                type="primary"
                style="margin-bottom:30px;"
                :loading="loginLoading2"
                :disabled="loginLoading1"
                @click.native.prevent="pkiSubmit"
              >{{pkiloginTxt}}</el-button>
            </div>
          </div>
        </el-form>
        <div class="hexagons">
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <br>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <br>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>

          <br>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <br>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
          <span>&#x2B22;</span>
        </div>
      </section>

      <div id="circle1">
        <div id="inner-cirlce1">
          <h2></h2>
        </div>
      </div>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>

    <div
      class="login-bottom center_row"
    >北京金之盾信息技术有限公司 版权所有Copyright 2005-2019 All Rights Reserved 技术支持</div>
  </div>
</template>
<script src="./login.js"></script>
<style lang="less" src="./login.less" scoped></style>
