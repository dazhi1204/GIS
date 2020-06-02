<template>
  <div class="warp">
    <div class="header"
         v-if="type == 'download' || type == 'del'">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   @change="handleCheckAllChange">全选</el-checkbox>
    </div>
    <div class="body">
      <el-checkbox-group v-if="type == 'download' || type == 'del'"
                         v-model="checked"
                         @change="handleCheckedChange">
        <el-checkbox v-for="item in senceList"
                     :label="item.sceneId"
                     :key="item.sceneId">{{item.sceneName}}</el-checkbox>
      </el-checkbox-group>
      <asp-input-upload v-else
                        :tips="'(多文件请打包上传，自动上传)'"
                        url="/gis-web/layerbus/insExcel"
                        :formData="fileParams"
                        @response="getRes"></asp-input-upload>
    </div>
    <div class="asp-dialog__footer">
      <!-- <el-button @click="cancel">取消</el-button> -->
      <el-button type="primary"
                 @click="submit">确认</el-button>
    </div>
  </div>
</template>
<script>
import chartApi from '@/api/chart'
import { mapGetters } from 'vuex'
export default {
  props: {
    type: {
      type: String,
      default: () => 'new'
    }
  },
  components: {
    // 相关控件
    aspInputUpload: () => import('@/components/asp-input-upload'),
  },
  data () {
    return {
      checkAll: false,
      checked: [],
      checkdata: [],
      isIndeterminate: true,
      fileParams: {
        type: 12,
        cityId: '12345'
      }
    };
  },
  computed: {
    ...mapGetters(['senceList','networkType', 'spaceType', 'dimen', 'cityId'])
  },
  methods: {
    getRes (res) {
      console.log(res)
    },
    // initData () {
      // let params = {
      //   type: this.dimen == "network" ? Number(this.networkType) : Number(this.spaceType),
      //   cityId: this.cityId,
      //   typeId: 1
      // }
      // chartApi.downExcelGetList(params).then(res => {
      //   this.checkdata = res.result
      // })
    //   this.checkdata = this.senceList
    //   console.log(this.senceList)
    // },
    cancel () {
      this.$emit('close', true)
    },
    submit () {
      if (this.type == 'download') {
        let params = {
          type: this.dimen == "network" ? Number(this.networkType) : Number(this.spaceType),
          cityId: this.cityId,
          ids: this.checked.toString()
        }
        chartApi.downExcel(params).then(res => {
          const link = window.URL.createObjectURL(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }))
          let downLoadElement = document.createElement('a')
          downLoadElement.href = link
          console.log()
          // downLoadElement.download = '分场景工参.xls'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(link)
        })
      } else if (this.type == 'del') {
        let params = {
          type: Number(this.networkType),
          sceneTypeId:this.dimen == "network" ? 0 : Number(this.spaceType),
          cityId: this.cityId,
          ids: this.checked.toString()
        }
        chartApi.delExcel(params).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }
      this.$emit('close', true)

    },
    handleCheckAllChange (val) {
      this.checked = val ? this.checkdata.map(item => item.sceneId) : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkdata.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkdata.length;
    }
  },
  mounted () {
    // if (this.type == 'download' || this.type == 'del') {
    //   this.initData()
    // }
    console.log(this.senceList)
    this.checkdata = this.senceList
    this.fileParams['type'] = this.networkType
    this.fileParams['cityId'] = this.cityId
  }
}
</script>

<style lang="scss" scoped>
.warp {
  width: 100%;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    height: 0.5rem;
    justify-content: center;
    align-items: center;
    width: 33%;
  }
  .body {
    display: flex;
    height: 10%;
    flex-grow: 1;
    /deep/.el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      margin: auto;
      width: 100%;
      // justify-content: center;
      align-items: center;
      .el-checkbox {
        width: 33%;
        margin: 0.1rem 0;
      }
    }
    & > div {
      margin: auto;
    }
  }
  /deep/ .el-checkbox__label {
    width: 0.8rem;
  }
}
</style>