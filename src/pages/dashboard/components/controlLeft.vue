<template>
  <div class="control">
    <el-radio-group class="yw-radio" v-model="dimenRadio">
      <el-radio-button label="network">网元配置与统计</el-radio-button>
      <el-radio-button label="space">区域配置与统计</el-radio-button>
    </el-radio-group>
    <el-radio-group
      v-show="dimenRadio == 'network'"
      class="yw-radio"
      v-model="networkType"
    >
      <el-radio-button
        :label="i.label"
        v-for="i in tab.networkType"
        :key="i.label"
      >
      {{i.name}}
        <!-- <el-dropdown trigger="click" placement="bottom-start">
          <span class="el-dropdown-link">
            {{ i.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="width:130px;">
            <el-checkbox-group v-model="checked" @change="handleCheckedChange">
              <el-checkbox
                v-for="item in dropData"
                style="width:100%;text-align: left;padding-left: 15px;"
                :label="item.name"
                :key="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown> -->
      </el-radio-button>
    </el-radio-group>
    <el-radio-group
      v-show="dimenRadio == 'space'"
      class="yw-radio"
      v-model="spaceType"
    >
      <el-radio-button
        :label="i.label"
        v-for="i in tab.spaceType"
        :key="i.label"
      >
      {{i.name}}
        <!-- <el-dropdown trigger="click" placement="bottom-start">
          <span class="el-dropdown-link">
            {{ i.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="width:130px;">
            <el-checkbox-group
              v-model="spaceCheck"
              @change="handleSpaceChecked"
            >
              <el-checkbox
                v-for="item in dropData"
                style="width:100%;text-align: left;padding-left: 15px;"
                :label="item.name"
                :key="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown> -->
      </el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
import chartApi from '@/api/chart'
import { mapGetters } from 'vuex'
export default {
  name: 'controlLeft',
  // props: ["date", "radio"],
  data() {
    return {
      dimenRadio: 'network',
      networkType: 12,
      spaceType: 21,
      dropData: [],
      checked: [],
      checkedId: [],
      spaceCheck: [],
      spaceCheckId: [],
      tab: {
        networkType: [
          {
            label: 11,
            name: '2G'
          },
          {
            label: 12,
            name: '4G'
          },
          {
            label: 13,
            name: '5G'
          }
        ],
        spaceType: [
          {
            label: 21,
            name: '场景'
          },
          {
            label: 22,
            name: 'OMC'
          },
          {
            label: 23,
            name: '自定义'
          }
        ]
      },
      // senceList: [] //自定义场景name和id
    }
  },
  computed: {
    ...mapGetters(['cityId', 'addstate'])
  },
  watch: {
    networkType: {
      handler(val) {
        this.$store.commit('controlLeft/SET_NETTYPE', val)
      },
      immediate: true
    },
    dimenRadio: {
      handler(val) {
        this.$store.commit('controlLeft/SET_DIMEN', val)
      }
    },
    spaceType: {
      handler(val) {
        this.$store.commit('controlLeft/SET_SPACETYPE', val)
      },
      immediate: true
    },
    // checked: {
    //   handler(val) {
    //     this.$store.commit('controlLeft/SET_CHECKDATA', val)
    //   }
    // },
    // checkedId: {
    //   handler(val) {
    //     this.$store.commit('controlLeft/SET_CHECKDATAS', val)
    //   }
    // },
    // spaceCheck: {
    //   handler(val) {
    //     this.$store.commit('controlLeft/SET_SPACECHECK', val)
    //   }
    // },
    // spaceCheckId: {
    //   handler(val) {
    //     this.$store.commit('controlLeft/SET_SPACECHECKID', val)
    //   }
    // },
    // senceList: {
    //   handler(val) {
    //     this.$store.commit('controlLeft/SET_SENCELIST', val)
    //   }
    // },
    // //框选保存之后数据改变重新加载自定义场景数据
    // addstate(val) {
    //   this.initData()
    // }
  },
  methods: {
    // handleCheckedChange(value) {
    //   this.checkedId = []
    //   this.senceList = []
    //   for (let i in this.checked) {
    //     for (let j in this.dropData) {
    //       if (this.dropData[j].name == this.checked[i]) {
    //         this.senceList.push({
    //           sceneName: this.dropData[j].name,
    //           sceneId: this.dropData[j].id
    //         })
    //         this.checkedId.push(this.dropData[j].id)
    //       }
    //     }
    //   }
    // },
    // handleSpaceChecked(value) {
    //   this.spaceCheckId = []
    //   this.senceList = []
    //   for (let i in this.spaceCheck) {
    //     for (let j in this.dropData) {
    //       if (this.dropData[j].name == this.spaceCheck[i]) {
    //         this.senceList.push({
    //           sceneName: this.dropData[j].name,
    //           sceneId: this.dropData[j].id
    //         })
    //         this.spaceCheckId.push(this.dropData[j].id)
    //       }
    //     }
    //   }
    // },
    // initData() {
    //   let params = {
    //     type: this.dimenRadio == 'network' ? this.networkType : this.spaceType,
    //     cityId: this.cityId,
    //     typeId: 1
    //   }
    //   chartApi.downExcelGetList(params).then(res => {
    //     this.dropData = res.result
    //     //  this.checked = [];
    //     //  this.checkedId = [];
    //     this.senceList = []
    //     let FirstData = []
    //     let FirstDataid = []
    //     // 初始设置选中
    //     //console.log(this.dropData)
    //     //默认框选第一个
    //     // FirstData.push(this.dropData[0].name);
    //     // FirstDataid.push(this.dropData[0].id)
    //     // this.checked = FirstData;
    //     // this.checkedId = FirstDataid;
    //     //this.senceList.push({'sceneName':this.dropData[0].name,'sceneId':this.dropData[0].id})
    //     //this.senceList = this.dropData.map(item => {'sceneName':item.name,'sceneId':item.id})
    //     //默认全选
    //     for (let i in this.dropData) {
    //       this.senceList.push({
    //         sceneName: this.dropData[i].name,
    //         sceneId: this.dropData[i].id
    //       })
    //     }
    //     if (this.dimenRadio == 'network') {
    //       this.checked = this.dropData.map(item => item.name)
    //       this.checkedId = this.dropData.map(item => item.id)
    //       this.$store.commit('controlLeft/SET_CHECKDATA', this.checked)
    //       this.$store.commit('controlLeft/SET_CHECKDATAS', this.checkedId)
    //     } else {
    //       this.spaceCheck = this.dropData.map(item => item.name)
    //       this.spaceCheckId = this.dropData.map(item => item.id)
    //       this.$store.commit('controlLeft/SET_SPACECHECK', this.spaceCheck)
    //       this.$store.commit('controlLeft/SET_SPACECHECKID', this.spaceCheckId)
    //     }
    //   })
    // },
    // // 初始化空间维度的选中值
    // initSpace() {
    //   let params = {
    //     type: this.spaceType,
    //     cityId: this.cityId,
    //     typeId: 1
    //   }
    //   chartApi.downExcelGetList(params).then(res => {
    //     let dropData = res.result
    //     //  this.checked = [];
    //     //  this.checkedId = [];
    //     let senceList = []
    //     for (let i in dropData) {
    //       senceList.push({
    //         sceneName: dropData[i].name,
    //         sceneId: dropData[i].id
    //       })
    //     }
    //     this.spaceCheck = dropData.map(item => item.name)
    //     this.spaceCheckId = dropData.map(item => item.id)
    //     this.$store.commit('controlLeft/SET_SPACECHECK', this.spaceCheck)
    //     this.$store.commit('controlLeft/SET_SPACECHECKID', this.spaceCheckId)
    //   })
    // }
  },
  mounted() {
    // this.initSpace()
  }
}
</script>
