<template>
  <div class="main-outBox">
    <div class="score-model-top">
      <div class="score-model-total">
        <div
          class="model-total-left"
          ref="totalleft"
          :style="{'height': widthData+'px','line-height':widthData+'px','margin-top':'-'+widthData/2+'px'}"
        >高</div>
        <div class="model-total-right">
          <div class="model-total-level">
            高危等级:一级
            <div class="model-total-num">12</div>
          </div>
          <div class="model-total-percent">5.25%</div>
          <el-progress
            style="width:90%;"
            :percentage="5.25"
            color="#F26053"
            stroke-width="8"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
      <div class="score-model-total">
        <div
          class="model-total-left model-total-orange"
          :style="{'height': widthData+'px','line-height':widthData+'px','margin-top':'-'+widthData/2+'px'}"
        >中</div>
        <div class="model-total-right">
          <div class="model-total-level">
            高危等级:二级
            <div class="model-total-num">34</div>
          </div>
          <div class="model-total-percent">25.25%</div>
          <el-progress
            style="width:90%;"
            :percentage="25.25"
            color="#F39454"
            stroke-width="8"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
      <div class="score-model-total">
        <div
          class="model-total-left model-total-yellow"
          :style="{'height': widthData+'px','line-height':widthData+'px','margin-top':'-'+widthData/2+'px'}"
        >低</div>
        <div class="model-total-right">
          <div class="model-total-level">
            高危等级:三级
            <div class="model-total-num">160</div>
          </div>
          <div class="model-total-percent">28.25%</div>
          <el-progress
            style="width:90%;"
            :percentage="28.25"
            color="#E2DF1E"
            stroke-width="8"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
      <div class="score-model-total">
        <div
          class="model-total-left model-total-blue"
          :style="{'height': widthData+'px','line-height':widthData+'px','margin-top':'-'+widthData/2+'px'}"
        >轻微</div>
        <div class="model-total-right">
          <div class="model-total-level">
            高危等级:四级
            <div class="model-total-num">422</div>
          </div>
          <div class="model-total-percent">41.25%</div>
          <el-progress
            style="width:90%;"
            :percentage="41.25"
            color="#53AEF4"
            stroke-width="8"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
    </div>
    <div class="score-model-center">
      <div class="score-model-graphical">
        <div class="score-model-title">年龄分布</div>
        <!-- 放echarts图的div -->
        <div id="echarts-age"></div>
      </div>
      <div class="score-model-graphical">
        <div class="score-model-title">案件类别</div>
        <!-- 放echarts图的div -->
        <div id="echarts-category"></div>
      </div>
      <div class="score-model-graphical">
        <div class="score-model-title">性别</div>
        <div class="score-sex">
          <div class="socre-man-sex">
            <img src="@assets/img/man.png" alt="男">
            <div class="sex-right">
              <div class="sex-tit">男性</div>
              <div class="sex-num">3194</div>
            </div>

          </div>
          <div class="socre-woman-sex">
            <img src="@assets/img/woman.png" alt="女">
            <div class="sex-right">
              <div class="sex-tit">女性</div>
              <div class="sex-num">1597</div>
            </div>
          </div>
        </div>
        <div class="score-percent">
            <div class="score-percent-level">
              <span class="fl">红色等级</span>
              <span class="fr">男性:92.4%</span>
            </div>
             <el-progress
            style="width:90%;"
            :percentage="92.4"
            color="#F26053"
            stroke-width="8"
            :show-text="false"
          ></el-progress>

          <div class="score-percent-level">
              <span class="fl">橙色等级</span>
              <span class="fr">男性:66.4%</span>
            </div>
             <el-progress
            style="width:90%;"
            :percentage="66.4"
            color="#F49555"
            stroke-width="8"
            :show-text="false"
          ></el-progress>

          <div class="score-percent-level">
              <span class="fl">黄色等级</span>
              <span class="fr">男性:45.4%</span>
            </div>
          <!-- <div class="model-total-percent"></div> -->
             <el-progress
            style="width:90%;"
            :percentage="45.4"
            color="#E2DF1E"
            stroke-width="8"
            :show-text="false"
          ></el-progress>

          <div class="score-percent-level">
              <span class="fl">蓝色等级</span>
              <span class="fr">男性:33.7%</span>
            </div>
          <!-- <div class="model-total-percent"></div> -->
             <el-progress
            style="width:90%;"
            :percentage="33.7"
            color="#56ADF2"
            stroke-width="8"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
    </div>
    <div class="score-model-bottom">
      <div class="score-model-suspect">
        <div class="score-model-title">嫌疑人</div>
        <div class="score-model-head">
          <div class="score-model-th" style="width:5%;">序号</div>
          <div class="score-model-th" style="width:19%;">姓名</div>
          <div class="score-model-th" style="width:22%;">身份证号</div>
          <div class="score-model-th" style="width:6%;">分数</div>
          <div class="score-model-th" style="width:8%;">高危等级</div>
          <div class="score-model-th" style="width:40%;">判断依据</div>
        </div>
        <!-- 放轮播的内容 -->
        <vue-seamless-scroll
          ref="carouselScroll"
          :data="xyrData"
          :class-option="classOption"
          class="carouselOutBox seamless-warp"
        >
          <ul class="carouselUl">
            <li v-for="(item,index) in xyrData" :key="index">
              <span style="width:5%;" v-text="index+1"></span>
              <span style="width:19%;" v-text="item.name" :title="item.name"></span>
              <span style="width:22%;" v-text="item.idNum" :title="item.idNum"></span>
              <span style="width:6%;" v-text="item.score" :title="item.score"></span>
              <span style="width:8%;"><i :style="{backgroundColor:item.color}">{{item.level}}</i></span>
              <span style="width:40%;" v-text="item.judge" :title="item.judge"></span>
            </li>
          </ul>
        </vue-seamless-scroll>
        <!-- <vue-seamless-scroll :data="listData" class="seamless-warp">
        <ul>
            <li v-for="(item,index) in listData" :key="index">
                <span v-text="item.title"></span>
                <span class="date" v-text="item.date"></span>
            </li>
        </ul>
        </vue-seamless-scroll>-->
      </div>
      <div class="score-model-group">
        <div class="score-model-title">人员团体</div>
        <!-- 人员团体 -->
        <div class="group-box">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >{{activity.content}}</el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./score_model_home_page.js"></script>
<style lang="less" src="./score_model_home_page.less" scoped></style>
