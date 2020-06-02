<template>
  <div>
    <el-input style="vertical-align: unset;"
              :placeholder="placeholder"
              :value="fileName"
              clearable
              @clear="clear"
              :disabled="disabled"
              @input="input">
      <el-upload slot="append"
                 ref="upload"
                 action=""
                 :show-file-list="false"
                 :data="formData"
                 :multiple="false"
                 :http-request="handleUpload"
                 :disabled="disabled">
        <el-button size="small"
                   type="primary"
                   style="color: #000;"
                   :loading="loading"
                   :disabled="loading">{{button}}</el-button>
      </el-upload>
    </el-input>
    <p style="padding-top: 5px;color:red"
       v-show="tips !== ''">{{tips}}</p>
  </div>
</template>

<script>
import echartApi from '@/api/chart.js'
export default {
  name: 'asp-input-upload',
  props: {
    placeholder: {
      type: [String, Number],
      default: '多文件请上传压缩包'
    },
    // 请求地址
    url: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: null
    },
    Size: {
      type: [String, Number],
      default: 20
    },
    button: {
      type: String,
      default: '点击上传'
    },
    tips: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: [String, Number]
  },
  // 是否只返回叶子节点，多选可用
  data () {
    return {
      loading: false,
      show: false,
      fileName: '',
      file: ''
    }
  },
  watch: {
    value (val) {
      this.fileName = val
    }
  },
  methods: {
    clear () {
      this.$emit('clear')
    },
    input (e) {
      console.log(e)
      this.fileName = e
    },
    async handleUpload (params) {
      if (Number(this.Size) * 1024 * 1024 > params.file.size) {
        this.loading = true
        const file = params.file
        console.log(file.type)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', this.formData['type'])
        formData.append('cityId', this.formData['cityId'])
        // 上传文件类型为excel
        if (file.type == 'application/vnd.ms-excel') {
          try {
            const res = await echartApi.insExcel(formData)
            this.file = res
            this.fileName = params.file.name
            this.loading = false
            this.$emit('input', this.fileName)
            this.$emit('response', res)
            this.$emit('onSuccess', params)
          } catch (e) {
            this.$message.error('上传失败!')
            console.log(e)
            this.$emit('onError', params)
            this.loading = false
          }
        } else {
          this.$message({
            message: '请上传excel文件',
            type: 'error'
          })
          this.loading = false
        }

      } else {
        this.$message(`文件大小超出${this.Size}M`)
      }
    }
  },
  mounted () {
    this.fileName = this.value
  }
}
</script>

<style lang="scss" scoped>
</style>