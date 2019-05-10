<template>
  <div class="inquire-parent">
    <div class="inquire-top">
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入身份证号" v-model="idNumber"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入姓名" v-model="name"></el-input>
        </el-col>
        <el-col :span="8">
          <!-- <el-radio-group v-model="radioColor">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">红色</el-radio>
            <el-radio :label="2">橙色</el-radio>
            <el-radio :label="3">黄色</el-radio>
            <el-radio :label="4">蓝色</el-radio>
          </el-radio-group> -->
        </el-col>
        <el-col :span="4">
          <el-button size="mini" icon="el-icon-search" @click="search">查询</el-button>
          <el-button size="mini" icon="el-icon-reset" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="inquire-middle">
      <ul class="ulstyle">
        <li v-for="(val, key) in userdata" :key="key">
          <div :class="badgeStyle">
            <span :class="badgeFont">{{key+1>9?key+1:"0"+(key+1)}}</span>
          </div>

          <div style="height:100%" :class="displyFlex">
            <div style="width:6%;height:100%">
              <!-- <img :src="val.imgsrc" /> -->
              <img src="../../../assets/img/user.png">
            </div>
            <div style="width:10%;height:80%;margin:auto 0;">
              <h3 style="margin:20px 0 0 5px;text-align:left;">{{val.xm}}</h3>
              <div style="height:7px;"></div>
              <p>{{val.sfzh}}</p>
            </div>
            <div style="width:10%;" :class="flexColumnBetween">
              <p>得分</p>
              <h4>{{val.scroe}}</h4>
            </div>
            <div style="width:10%;" :class="flexColumnBetween">
              <p>高危等级</p>
              <div
                :style="{lineHeight:'40px',
                   display:'inline-block',
                   textAlign:'center',
                   margin:'0 auto',
                   color:'#FFF',
                   fontWeight:800,
                   fontSize:'14px',
                   backgroundColor:'#'+val.wxjbColor,
                   width:'40px',
                   height:'40px',
                   borderRadius:'20px'}"
              >{{val.wxjb}}</div>
            </div>
            <div style="width:10%;" :class="flexColumnBetween">
              <p>是否精神病</p>
              <h4>{{val.sfjsb=="0"?"否":"是"}}</h4>
            </div>
            <div style="width:10%;" :class="flexColumnBetween">
              <p>同行次数</p>
              <h4>{{val.txcs}}</h4>
            </div>
            <div style="width:10%;" :class="flexColumnBetween">
              <p>同住次数</p>
              <h4>{{val.tzcs}}</h4>
            </div>
            <div style="width:10%;" :class="flexColumnBetween">
              <p>有无驾驶证</p>
              <h4>{{val.sfjsy=="0"?"无":"有"}}</h4>
            </div>
            <div style="width:19%;" :class="flexColumnBetween">
              <p>情况说明</p>
              <h4>{{val.qksm}}</h4>
            </div>
            <div style="width:5%;display: flex;align-items: center;">
              <el-button size="mini" @click="researchJudgment(val.id)">研判</el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="inquire-bottom">
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
    </div>
  </div>
</template>

<script src="./score_model_inquire.js"></script>
<style lang="less" src="./score_model_inquire.less" scoped></style>
