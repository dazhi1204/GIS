<template>
  <div class="warp">
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="(item, index) in dataList"
                   :label="item.label"
                   :key="index"><i class="line"
           :style="{background:item.color }"></i>{{ item.name }}</el-checkbox>
    </el-checkbox-group>
  </div>

</template>

<script>
export default {
  data () {
    return {
      dataList: [
        {
          label: 'one',
          name: '假数据假数据假数据假数据假数据',
          color: 'red'
        },
        {
          label: 'two',
          name: '假数据假数据假数据假数据假数据',
          color: '#fff'
        },
        {
          label: 'three',
          name: '假数据假数据假数据假数据假数据',
          color: 'rgba(225,225,225,0.5)'
        },
        {
          label: 'four',
          name: '假数据假数据假数据假数据假数据',
          color: 'red'
        },
        {
          label: 'one1',
          name: '假数据假数据假数据假数据假数据',
          color: 'red'
        },
        {
          label: 'two2',
          name: '假数据假数据假数据假数据假数据',
          color: 'blue'
        },
        {
          label: 'three3',
          name: '假数据假数据假数据假数据假数据',
          color: 'rgba(225,225,225,0.5)'
        },
        {
          label: 'four4',
          name: '假数据假数据假数据假数据假数据',
          color: 'yellow'
        }
      ],
      checkList: ['one', 'one1']
    };
  }
};
</script>

<style lang="scss" scoped>
.warp {
  display: flex;
  margin-bottom: 5px;
  .el-checkbox-group {
    margin: auto;
  }
  .el-checkbox {
    width: 25%;
    margin-right: 0;
    color: #fff;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .line {
    display: inline-table;
    vertical-align: middle;
    height: 3px;
    width: 40px;
    margin-right: 5px;
    background: red;
  }
}
</style>>