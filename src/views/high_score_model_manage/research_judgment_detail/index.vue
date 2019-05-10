<template>
  <div class="research-detail-parent">
    <div class="research-detail-top">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-blue">研判界面</div>
        </el-col>
      </el-row>
      <div class="header-user-info">
        <div class="header-user-left">
          <el-row :gutter="20">
            <el-col :span="12" class="col-left">
              <p>姓名:{{detailData.xm}}</p>
              <p>性别:{{detailData.sex}}</p>
              <p>出生:{{detailData.csrq|bornDateFormat}}</p>
              <el-row style="line-height:20px;">
                <el-col :span="4">住址:</el-col>
                <el-col :span="20">{{detailData.zzxz}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="9" class="col-right">
              <img :src="detailData.xp?'data:image/png;base64,'+detailData.xp:''" alt>
            </el-col>
          </el-row>
        </div>
        <div class="header-user-right">
          <el-row>
            <span class="ypFont">研判依据</span>
            <research-judgment-dialog ref="researchDialog" @refreshLCAglist="refreshLCAglist"></research-judgment-dialog>
            <el-button
              size="mini"
              @click="launch"
              style="padding: 7px 30px;background-color:#D32C24;color:#fff;border:0"
            >发起</el-button>
          </el-row>

          <div class="togo_row" style="margin-top:21px">
            <positive-circle v-model="detailSorce.scroe" :circle-style="totalCcoreStyle"></positive-circle>
            <div class="line"></div>
            <positive-circle v-model="detailSorce.jsbScore" :circle-style="scoreStyle"></positive-circle>
            <div class="line"></div>
            <positive-circle v-model="detailSorce.txScore" :circle-style="scoreStyle"></positive-circle>
            <div class="line"></div>
            <positive-circle v-model="detailSorce.tzScore" :circle-style="scoreStyle"></positive-circle>
            <div class="line"></div>
            <positive-circle v-model="detailSorce.tswScore" :circle-style="scoreStyle"></positive-circle>
            <div class="line"></div>
            <positive-circle v-model="detailSorce.qkScore" :circle-style="scoreStyle"></positive-circle>
            <div class="line"></div>
            <positive-circle v-model="detailSorce.jsyScore" :circle-style="scoreStyle"></positive-circle>
          </div>

          <div class="togo_row">
            <span style="margin-left:14px">总得分</span>
            <div class="line_display"></div>
            <span>{{detailSorce.sfjsb=="0"?"无":"有"}}精神病</span>
            <div class="detail_line_display" style="width:73px"></div>
            <span>同行{{detailSorce.txcs}}次</span>
            <div class="detail_line_display" style="width:78px"></div>
            <span>同住{{detailSorce.tzcs}}次</span>
            <div class="detail_line_display" style="width:73px"></div>
            <span>同上网{{detailSorce.swcs}}次</span>
            <div class="detail_line_display" style="width:57px"></div>
            <span>{{detailSorce.qkcs=="0"?"无":"有"}}侵财案前科</span>
            <div class="detail_line_display" style="width:58px"></div>
            <span>{{detailSorce.sfjsy=="0"?"无":"有"}}驾驶证</span>
          </div>

          <el-row style="margin-top:15px">
            危险等级
            <positive-circle
              v-model="detailSorce.wxjb"
              :circle-style="{
                bgColor: '#'+detailSorce.wxjbColor,
                diameter: '40px',
                fontColor: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                borderWidth: '1px',
                borderColor: '#E26D63'}"
            ></positive-circle>
          </el-row>
        </div>
      </div>
    </div>
    <div class="research-detail-middle">
      <div class="middle-top">
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-blue">研判流程</div>
          </el-col>
        </el-row>
        <div>
          <ag-grid-vue
            style="width:100%;height:100%;"
            class="table ag-theme-balham"
            :gridOptions="gridOptions"
          ></ag-grid-vue>
        </div>

        <div style="margin:5px 0 10px 280px">
          <el-timeline>
            <el-timeline-item
              v-if="fqArr.length==0?false:true"
              timestamp="发起"
              placement="top"
              icon="el-icons icon-launch"
              color="#CF67EB"
            >
              <p class="grayColor">{{fqArr[0].ry}}&nbsp;&nbsp;&nbsp;&nbsp;{{fqArr[0].sj}}</p>
              <p class="grayColor">{{fqArr[0].nr}}</p>
            </el-timeline-item>
            <el-timeline-item
              v-if="qsArr.length==0?false:true"
              timestamp="签收"
              placement="top"
              icon="el-icons icon-signing"
              color="#3A7FE7"
            >
              <p class="grayColor">{{qsArr[0].ry}}&nbsp;&nbsp;&nbsp;&nbsp;{{qsArr[0].sj}}</p>
              <p class="grayColor">{{qsArr[0].nr}}</p>
            </el-timeline-item>
            <el-timeline-item
              v-if="fkArr.length==0?false:true"
              timestamp="反馈"
              placement="top"
              icon="el-icons icon-feedback"
              color="#F8C677"
            >
              <p class="grayColor">{{fkArr[0].ry}}&nbsp;&nbsp;&nbsp;&nbsp;{{fkArr[0].sj}}</p>
              <p class="grayColor">{{fkArr[0].nr}}</p>
            </el-timeline-item>
            <el-timeline-item
              v-if="tgArr.length==0?false:true"
              timestamp="通过"
              placement="top"
              icon="el-icons icon-passed"
              color="#2AD762"
            >
              <p class="grayColor">{{tgArr[0].ry}}&nbsp;&nbsp;&nbsp;&nbsp;{{tgArr[0].sj}}</p>
              <p class="grayColor">{{tgArr[0].nr}}</p>
            </el-timeline-item>
            <el-timeline-item
              v-if="thArr.length==0?false:true"
              timestamp="退回"
              placement="top"
              icon="el-icons icon-return"
              color="#F3563E"
            >
              <p class="grayColor">{{thArr[0].ry}}&nbsp;&nbsp;&nbsp;&nbsp; {{thArr[0].sj}}</p>
              <p class="grayColor">{{thArr[0].nr}}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
    <div style="position: fixed;bottom:0;left:0;right:0">
      <main-footer></main-footer>
    </div>
  </div>
</template>
<script src="./research_judgment_detail.js"></script>
<style lang="less" src="./research_judgment_detail.less" scoped></style>
