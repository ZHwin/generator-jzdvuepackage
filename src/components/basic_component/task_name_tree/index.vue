<template>
  <div>
    <public-tree
      ref="publicTree"
      :data="rwmcData"
      type="select"
      :input-width="inputWidth"
      :select-width="selectWidth"
    ></public-tree>
  </div>
</template>

<script src="./task_name_tree.js"></script>
<style lang="less" src="./task_name_tree.less" scoped></style>
