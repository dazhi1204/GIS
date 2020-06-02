<template>
  <div class="content-box">
    <el-tabs v-model="activeName"
             type="card"
             @tab-click="handleClick">
      <el-tab-pane label="图层管理"
                   name="first">
        <coverage></coverage>
      </el-tab-pane>
      <el-tab-pane label="接口管理"
                   name="second">
        <port></port>
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="right">
      <el-tooltip class="item"
                  effect="dark"
                  content="返回首页"
                  placement="bottom">
        <i class="setting iconfont iconfanhui"
           @click="goIndex()"></i>
      </el-tooltip>
    </div> -->
  </div>
</template>
<script>
export default {
  components: {
    coverage: () =>
      import('./coverage'),
    port: () =>
      import('./port'),
  },
  data () {
    return {
      activeName: 'first'
    };
  },
  methods: {
    // goIndex () {
    //   this.$router.push({
    //     path: '/dashbord'
    //   })
    // },
    handleClick (tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.right {
  position: absolute;
  top: 5px;
  right: 15px;
  cursor: pointer;
  & .iconfont {
    font-size: 30px;
  }
}
.el-tabs{
	width: 100%;
}
</style>