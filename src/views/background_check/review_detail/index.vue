<template>
  <!-- 详情页面 -->
  <div id="detail-outBox" style="media:print">
    <!-- 审查结果展示 -->
    <div class="scjg-div">
      <el-row>
        <el-col :span="24">
          <h4 class="detail-title">审查结果</h4>
        </el-col>
      </el-row>

      <div class="detail-main-box">
        <el-row align="left" style="text-align:left;margin-bottom:0;">
          <el-col :span="24">
            <div class="searching-title">
              <span class="fl">审查结果</span>
            </div>
          </el-col>
        </el-row>

        <el-row align="left" style="border:1px solid #E5E5E5;margin-bottom:0;padding-bottom:20px;">
          <el-col :span="4">
            <div class="detail-bjxx">背景信息:</div>
          </el-col>
          <el-col :span="20">
            <p class="detail-rylbbj">{{detailRylb}}</p>
            <p
              class="detail-rylbbjxx"
              v-for="(item,key) in detailBjxx"
              :key="key"
            >{{`${key+1}.${item}`}}</p>
          </el-col>
        </el-row>

        <el-row align="left" style="border:1px solid #E5E5E5;border-top:0;">
          <el-col :span="4">
            <div class="detail-scjl">审查结论:</div>
          </el-col>
          <el-col :span="20">
            <div class="detail-scjl-result">
              <img v-if="detailScjl==='不予通过'" src="@assets/img/nopass.png" alt>
              <img
                v-else-if="detailScjl==='证件有误'||detailScjl==='身份存疑'"
                src="@assets/img/unsure.png"
                alt
              >
              <img
                v-else-if="detailScjl==='通过'||detailScjl==='提前5个月出所'||detailScjl==='提前3个月出所'||detailScjl==='已出所'"
                src="@assets/img/pass.png"
                alt
              >
              <span :class="detailScjl=='通过'||detailScjl=='提前5个月出所'||detailScjl=='提前3个月出所'||detailScjl=='已出所'?'passTxt':detailScjl=='不予通过'?'noPassTxt':''">{{detailScjl}}</span>
            </div>
          </el-col>
        </el-row>

        <el-row align="left" style="text-align:left;margin-bottom:0;">
          <el-col :span="24">
            <div class="searching-title searching-title-purple">
              <span class="fl">基本信息</span>
            </div>
          </el-col>
        </el-row>

        <el-row align="left" style="border:1px solid #E5E5E5;margin-bottom:0;">
          <el-col :span="6">
            <div class="detai-photo">
              <b v-if="detailPhoto==``">暂无图片</b>
              <img :src="'data:image/png;base64,'+detailPhoto" alt>
            </div>
          </el-col>
          <el-col :span="9">
            <span class="detail-key">姓名:</span>
            <span class="detail-val">{{detailName}}</span>
            <span class="detail-key">身份证号:</span>
            <span class="detail-val">{{detailSfzh}}</span>
            <span class="detail-key">性别:</span>
            <span class="detail-val">{{detailSex}}</span>
            <span class="detail-key">出生日期:</span>
            <span class="detail-val">{{detailCsrq}}</span>
          </el-col>
          <el-col :span="9">
            <span class="detail-key">民族:</span>
            <span class="detail-val">{{detailMz}}</span>
            <span class="detail-key">地址:</span>
            <span class="detail-val">{{detailDz}}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 打印按钮 -->
    <el-button class="not-print" type="primary" @click="printPage" size="small" icon="el-icon-printer">打印本页</el-button>
  </div>
</template>

<script src="./review_detail.js"></script>
<style lang="less" src="./review_detail.less" scoped></style>
