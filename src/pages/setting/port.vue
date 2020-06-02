<template>
  <div class="content-box">
    <div class="left">
      <div class="cover">
        <el-menu unique-opened
                 :default-active="String(active.layerApiId)">
          <el-submenu v-for="item in coverData"
                      :index="String(item.layerTypeId)"
                      :key="String(item.layerTypeId)">
            <template slot="title">
              <span>{{ item.layerTypeName }}</span>
            </template>
            <el-menu-item v-for="i in item.layerApi"
                          :index="String(i.layerApiId)"
                          :key="String(i.layerApiId)"
                          @click="getItem(i)">{{ i.layerApiName }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="right">
      <config :active="this.active"
              @reset="reset"></config>
    </div>
  </div>
</template>
<script>
// import dashboard from '@/api/dashboard.js'
import portConfig from '@/api/portConfig.js'
export default {
  components: {
    config: () => import('./components/portConfig')
  },
  data () {
    return {
      coverData: [
        {
          layerTypeName: '扇区图层',
          layerTypeId: '1',
          layerApiId: [
            {
              layerName: '扇区',
              layerId: '611'
            }
          ]
        }
      ],
      active: {}
    }
  },
  methods: {
    getItem (i) {
      this.active = i
    },
    reset () {
      portConfig.getLayerApiList().then(res => {
        this.coverData = res.result
        // 重新定位
        this.active = this.coverData[0].layerApi[0]
      })
    }
  },
  mounted () {
    portConfig.getLayerApiList().then(res => {
      this.coverData = res.result
      this.active = this.coverData[0].layerApi[0]
    })
  }
}
</script>

<style lang="scss" scoped>
.cover {
  padding: 0 20px;
  & > ul {
    height: 430px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .cover-item {
    width: 100%;
    height: 32px;
    color: black;
    margin-bottom: 8px;
    padding: 0 10px;
    line-height: 30px;
    cursor: pointer;
    /deep/ .el-icon-close {
      font-size: 20px;
      float: right;
      height: 32px;
      width: 32px;
      line-height: 32px;
    }
  }
  .cover-item:hover {
    background-color: #409eff;
    border-color: #409eff;
  }
  .active {
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>