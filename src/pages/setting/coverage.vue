<template>
  <div class="content-box">
    <div class="left">
      <div class="cover"
           ref="allCheck">
        <el-button class="cover-item"
                   size="small"
                   type="success"
                   @click="showInput">新建图层</el-button>
        <el-button class="cover-item"
                   size="small"
                   type="success"
                   @click="layerCheck">确认修改</el-button>
        <ul class="layerlist"
            v-if="layerlist"
            @mouseleave="layerHide">
          <li class="cover_layer"
              v-for="item in coverLayer"
              :key="item.id"
              @click="editName(item)">{{ item.name }}</li>
        </ul>

        <el-tag class="cover-item"
                v-for="(item,index) in coverData"
                :key="item.layerId"
                closable
                @close="handleClose(item)"
                @click="getChildDate(item)"
                @dblclick.native="editLayerName(item)"
                v-dragging="{ item: item, list: coverData, group: 'item.layerId' }">
          <input name="check"
                 type="checkbox"
                 :checked="checkLayer.indexOf(item.layerId)>=0"
                 class="layerCheck"
                 :data-id="item.layerId"></input>
          {{ item.layerName }}
        </el-tag>

      </div>
    </div>
    <div class="right">
      <config v-show="layerTypeId == 1"
              ref='config'
              :FromParent='toChildren'></config>
      <grid v-show="layerTypeId == 2"
            ref='grid'
            :FromParent='toChildren'></grid>
      <heat v-show="layerTypeId == 3"
            ref="heat"
            :FromParent='toChildren'></heat>
      <flight v-show="layerTypeId == 4"
              ref="flight"
              :FromParent='toChildren'></flight>
      <poi v-show="layerTypeId == 5"
           ref="poi"
           :FromParent='toChildren'></poi>
      <poly v-show="layerTypeId == 6"
            ref="poly"
            :FromParent='toChildren'></poly>
    </div>
  </div>
</template>
<script>
import { getLayerAll } from '@/api/coverage.js'
import { insLayer } from '@/api/coverage.js'
import { delLayer } from '@/api/coverage.js'
import { selSectorNetwork } from '@/api/coverage.js'
import { selSectorDraw } from '@/api/coverage.js'
import { editLayerName } from '@/api/coverage.js'
import { setLayerShow } from '@/api/coverage.js'
import { ShowLayerData } from '@/api/dashboard.js'
var time = null;
export default {
  components: {
    config: () =>
      import('./components/coverageConfig'),
    grid: () =>
      import('./components/coverageGrid'),
    heat: () =>
      import('./components/coverageHeat'),
    flight: () =>
      import('./components/coverageLine'),
    poi: () =>
      import('./components/coveragePoint'),
    poly: () =>
      import('./components/coveragePolygon')
  },
  data () {
    return {
      coverLayer: [{
        "id": "1",
        "name": "扇区图层"
      }, {
        "id": "2",
        "name": "栅格图层"
      }, {
        "id": "3",
        "name": "热力图图层"
      }, {
        "id": "4",
        "name": "飞线图层"
      }, {
        "id": "5",
        "name": "点图层"
      }, {
        "id": "6",
        "name": "多边形图层"
      }],
      layerTypeId: '',
      coverData: [],
      checkLayer: [],
      layerlist: false,
      toChildren: {
        'network': '',
        'draw': ''
      },
      setmodel: false
    }
  },
  watch: {
    setmodel: {
      handler (val) {
        this.$store.commit('controlModel/SET_SETMODEL', val)
      }
    },
  },
  methods: {
    handleClose (tag) {
      this.coverData.splice(this.coverData.indexOf(tag), 1)
      let params = {
        "layerId": parseInt(tag.layerId)
      }
      delLayer(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
      })
    },
    //控制图层显示
    layerCheck () {
      let CheckDom = this.$refs.allCheck.getElementsByClassName('layerCheck');
      let layerId = new Array();
      for (var i = 0; i < CheckDom.length; i++) {
        if (CheckDom[i].checked) {
          layerId.push(CheckDom[i].dataset.id);
        }
      }
      var layertype = layerId.toString()
      setLayerShow({
        'array': layertype
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.setmodel = true;
        }
      })
    },
    getChildDate (tag) { //子组件传值
      this.layerTypeId = tag.layerTypeId;
      if (this.layerTypeId == 1) {
        this.$refs.config.getChildDate(tag);
      } else if (this.layerTypeId == 2) {
        this.$refs.grid.getChildDate(tag);
      } else if (this.layerTypeId == 3) {
        this.$refs.heat.getChildDate(tag);
      } else if (this.layerTypeId == 4) {
        this.$refs.flight.getChildDate(tag);
      } else if (this.layerTypeId == 5) {
        this.$refs.poi.getChildDate(tag);
      } else {
        this.$refs.poly.getChildDate(tag);
      }

    },
    showInput () {
      this.layerlist = true
    },
    layerHide () {
      this.layerlist = false
    },
    editName (tag) {
      clearTimeout(time); //设置定时器区分单击和双击
      time = setTimeout(() => {
        this.$prompt('请输入图层名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({
          value
        }) => {
          if (value == '' || value == null) {
            this.$message({
              type: 'warning',
              message: '图层名称不能为空'
            });

          } else {

            let params = {
              "layerName": value,
              "layerTypeId": parseInt(tag.id)
            }
            if (value) {
              insLayer(params).then(res => {
                if (res.code == 200) {
                  this.coverData.push({
                    layerId: res.result.layerId,
                    layerName: value,
                    layerTypeId: res.result.layerTypeId,
                    layerTypeName: tag.name
                  });
                  this.layerlist = false
                } else {
                  this.$message({
                    type: 'warning',
                    message: res.massege
                  });
                }

              })

            }

          }

        }).catch(() => { });
      }, 300);
    },
    editLayerName (tag) {
      clearTimeout(time);
      this.$prompt('编辑图层名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({
        value
      }) => {
        if (value == '' || value == null) {
          this.$message({
            type: 'warning',
            message: '图层名称不能为空'
          });

        } else {
          if (value) {
            tag.layerName = value;

            let params = {
              'layerId': tag.layerId,
              'newLayerName': value
            }
            editLayerName(params).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
              } else {
                this.$message({
                  type: 'warning',
                  message: res.massege
                });
              }

            })

          }

        }

      }).catch(() => { });
    },

  },
  mounted () {
    getLayerAll().then(res => {
      if (res.code == 200) {
        this.coverData = res.result;

      }
    });

    //网络制式
    selSectorNetwork().then(res => {
      if (res.code == 200) {
        this.toChildren.network = res.result;
      }
    });
    //频点频段
    selSectorDraw().then(res => {
      if (res.code == 200) {
        this.toChildren.draw = res.result
      }
    });
    //图层列表拖拽排序
    this.$dragging.$on('dragged', ({
      value
    }) => {
      console.log(value.item)
      console.log(value.list)
    })
    this.$dragging.$on('dragend', () => {

    });
    ShowLayerData().then(res => {
      if (res.code == 200) {
        var List = res.result;
        for (var i in List) {
          this.checkLayer.push(List[i].layerId)
        }
      }

    })

  }
}
</script>

<style lang="scss" scoped>
.cover {
  padding: 0 20px;
  max-height: 480px;
  overflow: auto;
  .cover-item {
    width: 100%;
    height: 32px;
    margin-bottom: 8px;
    padding: 0 10px;
    line-height: 30px;
    cursor: pointer;
    text-align: center;
    /deep/ .el-icon-close {
      font-size: 20px;
      float: right;
      height: 32px;
      width: 32px;
      line-height: 32px;
    }
  }
}

.layerCheck {
  float: left;
  margin-top: 8px;
}

ul li {
  list-style: none;
}

.layerlist {
  text-align: center;
  position: absolute;
  width: 130px;
  padding: 10px;
  left: 240px;
  top: 0px;
  z-index: 1;
  border-radius: 5px;
  background: #ecf5ff;
  color: #409eff;
  border: 1px solid #eee;
}

.cover_layer {
  width: 100%;
  border-radius: 5px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
}

.cover_layer:hover {
  background: #67c23a;
}

.el-button + .el-button {
  margin-left: 0;
}

.right {
  margin-left: 20px;
}
</style>