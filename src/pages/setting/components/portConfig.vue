<template>
  <div class="content-box">
    <el-form ref="apiData"
             :rules="rules"
             :model="apiData">
      <el-form-item label="接口名称:"
                    style="margin-bottom: 40px;"
                    prop="layerApiName">
        <el-input v-model="apiData.layerApiName"
                  :disabled="disabled"></el-input>
      </el-form-item>
      <!-- <p>接口属性{{ this.active }}</p> -->
      <div class="divider"></div>
      <!-- 显示隐藏不要用v-show，对校验有影响 -->
      <!-- 扇区接口 -->
      <div class="apiBlock"
           v-if="this.active.layerTypeId === 1">
        <el-form-item prop="sectorDrawApi"
                      label="扇区绘制接口:">
          <el-input v-model="apiData.sectorDrawApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="sectorTanchuangApi"
                      label="扇区弹窗信息接口:">
          <el-input v-model="apiData.sectorTanchuangApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="sectorZhibiaoApi"
                      label="扇区指标接口:">
          <el-input v-model="apiData.sectorZhibiaoApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="sectorKuangxuanApi"
                      label="扇区框选分析接口:">
          <el-input v-model="apiData.sectorKuangxuanApi"
                    :disabled="disabled"></el-input>
        </el-form-item> -->
      </div>
      <!-- 栅格接口 -->
      <div class="apiBlock"
           v-if="this.active.layerTypeId === 2">
        <el-form-item prop="sectorDrawApi"
                      label="栅格绘制接口:">
          <el-input v-model="apiData.gridDrawApi1"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="sectorDrawApi"
                      label="栅格绘制接口（地图11~16级）:">
          <el-input v-model="apiData.gridDrawApi2"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="sectorDrawApi"
                      label="栅格绘制接口（地图17~19级）:">
          <el-input v-model="apiData.gridDrawApi3"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="sectorDrawApi"
                      label="栅格弹窗信息接口:">
          <el-input v-model="apiData.gridTanchuangApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="gridKuangxuanApi"
                      label="栅格框选分析接口:">
          <el-input v-model="apiData.gridKuangxuanApi"
                    :disabled="disabled"></el-input>
        </el-form-item> -->
      </div>
      <!-- 热力图接口 -->
      <div class="apiBlock"
           v-if="this.active.layerTypeId === 3">
        <el-form-item prop="sectorDrawApi"
                      label="热力图绘制接口:">
          <el-input v-model="apiData.heatmapDrawApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
      </div>
      <!-- 飞线图接口 -->
      <div class="apiBlock"
           v-if="this.active.layerTypeId === 4">
        <el-form-item prop="flylineDrawApi"
                      label="飞线图绘制接口:">
          <el-input v-model="apiData.flylineDrawApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="flylineTanchuangApi"
                      label="飞线图弹窗信息接口:">
          <el-input v-model="apiData.flylineTanchuangApi"
                    :disabled="disabled"></el-input>
        </el-form-item> -->
      </div>
      <!-- 点图接口 -->
      <div class="apiBlock"
           v-if="this.active.layerTypeId === 5">
        <el-form-item prop="sectorDrawApi"
                      label="点绘制接口:">
          <el-input v-model="apiData.pointDrawApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="sectorDrawApi"
                      label="点弹窗信息接口:">
          <el-input v-model="apiData.pointTanchuangApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="pointKuangxuanApi"
                      label="点框选分析接口:">
          <el-input v-model="apiData.pointKuangxuanApi"
                    :disabled="disabled"></el-input>
        </el-form-item> -->
      </div>
      <!-- 多边形接口 -->
      <div class="apiBlock"
           v-if="this.active.layerTypeId === 6">
        <el-form-item prop="sectorDrawApi"
                      label="多边形绘制接口:">
          <el-input v-model="apiData.polygonDrawApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="sectorDrawApi"
                      label="多边形弹窗信息接口:">
          <el-input v-model="apiData.polygonTanchuangApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="polygonZhibiaoApi"
                      label="多边形指标接口:">
          <el-input v-model="apiData.polygonZhibiaoApi"
                    :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item prop="polygonKuangxunApi"
                      label="多边形框选分析接口:">
          <el-input v-model="apiData.polygonKuangxunApi"
                    :disabled="disabled"></el-input>
        </el-form-item> -->
      </div>
      <!-- 操作按钮 -->
      <el-form-item v-show="disabled"
                    style="text-align: left;">
        <el-button type="success"
                   @click="add">新建</el-button>
        <el-button type="primary"
                   @click="edit">编辑</el-button>
        <el-button type="danger"
                   @click="del">删除</el-button>
      </el-form-item>
      <el-form-item v-show="!disabled"
                    style="text-align: left;">
        <el-button type="primary"
                   @click="submit('apiData')">保存</el-button>
        <el-button type="warning"
                   @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import portConfig from '@/api/portConfig.js'
export default {
  props: {
    active: {
      type: Object,
      default: () => {
        layerTypeId: 1
      }
    }
  },
  data () {
    return {
      apiData: {},
      newApiData: {
        "name": "000000",
        "layerTypeId": "",
        "layerApiName": "",
        "flylineDrawApi": "http://127.0.0.1:32767/start",
        "flylineTanchuangApi": "http://127.0.0.1:32767/start",
        "gridDrawApi1": "http://127.0.0.1:32767/start",
        "gridDrawApi2": "http://127.0.0.1:32767/start",
        "gridDrawApi3": "http://127.0.0.1:32767/start",
        "gridKuangxuanApi": "http://127.0.0.1:32767/start",
        "gridTanchuangApi": "http://127.0.0.1:32767/start",
        "heatmapDrawApi": "http://127.0.0.1:32767/start",
        "pointDrawApi": "http://127.0.0.1:32767/start",
        "pointKuangxuanApi": "http://127.0.0.1:32767/start",
        "pointTanchuangApi": "http://127.0.0.1:32767/start",
        "polygonDrawApi": "http://127.0.0.1:32767/start",
        "polygonKuangxunApi": "http://127.0.0.1:32767/start",
        "polygonTanchuangApi": "http://127.0.0.1:32767/start",
        "polygonZhibiaoApi": "http://127.0.0.1:32767/start",
        "sectorDrawApi": "http://127.0.0.1:32767/start",
        "sectorKuangxuanApi": "http://127.0.0.1:32767/start",
        "sectorTanchuangApi": "http://127.0.0.1:32767/start",
        "sectorZhibiaoApi": "http://127.0.0.1:32767/start"
      },
      disabled: true,
      // 是否为新增
      isNew: true,
      rules: {
        layerApiName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ],
        sectorDrawApi: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        sectorTanchuangApi: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        // gridDrawApi1: this.apiRule,
        // gridDrawApi2: this.apiRule,
        // gridDrawApi3: this.apiRule,
        // gridTanchuangApi: this.apiRule,
        // heatmapDrawApi: this.apiRule,
        flylineDrawApi: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        flylineTanchuangApi: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        // pointDrawApi: this.apiRule,
        // pointTanchuangApi: this.apiRule,
        // polygonDrawApi: this.apiRule,
        // polygonTanchuangApi: this.apiRule
      }
    }
  },
  watch: {
    active (val) {
      this.getApiData(this.active.layerApiId)
    }
  },
  methods: {
    add () {
      this.disabled = false
      this.isNew = true
      // 解决初次加载无法赋值的问题
      this.newApiData.layerTypeId = this.active.layerTypeId
      this.apiData = JSON.parse(JSON.stringify(this.newApiData))
    },
    edit () {
      this.disabled = false
      this.isNew = false
    },
    del () {
      this.$confirm('确定删除此接口？注:此操作不可撤销。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          layerApiId: this.active.layerApiId
        }
        portConfig.delLayerApi(obj).then(res => {
          if (res.code === 200) {
            this.$message({
              message: res.massege,
              type: 'success'
            })
            this.disabled = true
            this.$emit('reset')
            this.getApiData(this.active.layerApiId)
          } else {
            this.$message({
              message: res.massege,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
		   console.log(valid)
        if (valid && this.isNew) {
          portConfig.addLayerApi(this.apiData).then(res => {
            if (res.code === 200) {
              this.$message({
                message: res.massege,
                type: 'success'
              })
              this.disabled = true
              this.$emit('reset')
              this.getApiData(this.active.layerApiId)
            } else {
              this.$message({
                message: res.massege,
                type: 'error'
              })
            }
          })
        } else if (valid && !this.isNew) {
          portConfig.editLayerApi(this.apiData).then(res => {
			 
            if (res.code === 200) {
              this.$message({
                message: res.massege,
                type: 'success'
              })
              this.disabled = true
              this.$emit('reset')
              this.getApiData(this.active.layerApiId)
            } else {
              this.$message({
                message: res.massege,
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    cancel () {
      this.disabled = true
    },
    getApiData (params) {
      let obj = {
        layerApiId: params
      }
      portConfig.selLayerApi(obj).then(res => {
        this.apiData = res.result
      })
    }
  },
  mounted () {
    this.getApiData(this.active.layerId)
  }
}
</script>
<style lang="scss" scoped>
.content-box {
  width: 400px;
  .el-form {
    width: 100%;
    // /deep/ .el-form-item__label {
    //   color: #fff;
    // }
  }
}
</style>