<template>
  <div class="sence">
    <p>
      <span>自定义场景名:</span>
      <el-input v-model="sencename"
                type='text'
                maxlength="10"></el-input>

    </p>
    <div class="conent">
      <li v-for="(item,i) in Datalist">
        <span style="margin-right: 10px;">小区:</span><span>{{item.communityName}}</span>
      </li>
    </div>
    <div class="btn">
      <el-button @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { creatScene } from '@/api/dashboard.js'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      sencename: '',
      Datalist: '',
      polygonArr: [],
	  geometryId:'',
      addstate: []
    }
  },
  computed: {
    ...mapGetters(['cityId', 'networkType'])
  },
  watch: {
    addstate: {
      handler (val) {
        this.$store.commit('controlLeft/SET_ADDSTATE', val)
      }
    }
  },
  methods: {
    ChangeName (val, points,type) {
      this.Datalist = val;
      this.polygonArr = points;
	  this.geometryId = type;
    },
    save () {
      if (this.sencename == '') {
        this.$message({
          type: 'warning',
          message: '请输入场景名'
        });
      } else {
        let eciList = [];
        for (var i in this.Datalist) {
          eciList.push(this.Datalist[i].eci)
        }
        
		if(this.networkType == '11'){
			var networkType = '2G'
		}else if(this.networkType == '12'){
			var networkType = '4G'
		}else{
			var networkType = '5G'
		}
		
		if(this.geometryId == 2){
			var params = {
			  "sceneName": this.sencename,
			  "eciList": eciList,
			  "cityId": this.cityId,
			  "networkType": networkType,
			  'points': this.polygonArr,
			  "geometryId":this.geometryId
			}
		}else{
			var params = {
			  "sceneName": this.sencename,
			  "eciList": eciList,
			  "cityId": this.cityId,
			  "networkType": networkType,
			  'circle': this.polygonArr,
			  "geometryId":this.geometryId
			}
		}
        

        creatScene(params).then(res => {
          if (res.code == 200) {
            //保存成功之后需要重新加载自定义场景
            this.addstate.push(this.polygonArr);
			this.sencename='';
            this.$message({
              type: 'success',
              message: '创建成功'
            });
            this.$emit('senceHide', false)
          } else {
            this.$message({
              type: 'warning',
              message: res.massege
            });
          }
        })
      }
    },
    cancel () {
      this.$emit('senceHide', false)
    }

  }
}
</script>

<style lang="scss" scoped>
.sence {
  background: #ffffff;
  width: 360px;
  height: 240px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -180px;
  margin-top: -120px;
  color: #0b1c74;
  padding: 15px;
  border-radius: 5px;
}

li {
  list-style: none;
}

.el-input--mini {
  display: inline-block;
  width: 120px;
  margin-left: 20px;
}

.conent {
  margin-top: 20px;
  overflow: auto;
  text-align: left;
  height: 110px;
}

.btn {
  margin-top: 20px;
}
</style>