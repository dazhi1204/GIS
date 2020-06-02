<template>
	<div class="table">
		<el-table :data="tableData" border fit style="width: 100%">
			<el-table-column align="center" v-for="(item, i) in tableLaber" min-width="100" show-overflow-tooltip :property="item.key" :label="item.label" :key="i">
				<template slot-scope="scope">
					<span v-if="i > 3" :style="consoleProp(scope.column.property, scope.row[scope.column.property]) ? 'color:red;' : ''">
						{{ scope.row[scope.column.property] }}
					</span>
					<span v-else>{{ scope.row[scope.column.property] }}</span>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination background @current-change="handleCurrentChange" layout="total, prev, pager, next" :total="total" style="margin:20px 0 0 0"></el-pagination>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getProblemCellList } from '@/api/dashboard.js';
export default {
	name: 'problemcellModel',
	data() {
		return {
			tableLaber: [],
			tableData: [],
			compare: [],
			PageNo: 1,
			total: 0
		};
	},
	mounted() {
		this.ProblemCellList();
	},
	computed: {
		...mapGetters(['networkType', 'timeTypeId', 'time', 'cityId'])
	},
	watch: {
		time(val) {
			this.ProblemCellList();
		}
	},
	methods: {
		//问题小区列表
		ProblemCellList() {
			let networkType = '';
			if (this.networkType == '11') {
				networkType = 1;
			} else if (this.networkType == '12') {
				networkType = 2;
			} else {
				networkType = 3;
			}
			let params = {
				type: networkType,
				cityId: this.cityId,
				timeTypeId: this.timeTypeId,
				time: this.time,
				pageNo: this.PageNo
			};
			getProblemCellList(params).then(res => {
				if (res.code == 200) {
					this.tableLaber = res.result.tableLaber;
					var list = res.result.data;
					this.tableData = list;
					this.compare = res.result.compare;
					this.currentPage = res.result.pageSum
					this.total = res.result.sum;
				}
			});
		},
		consoleProp(key, val) {
			let item = this.tableLaber.filter(item => item.key === key);
			
			if(item[0]==''){
				if (val<=item[0].large) {
					return true;
				} else {
					return false;
				}
			}else if(item[0].large == ''){
				if (val >= item[0].val ) {
					return true;
				} else {
					return false;
				}
			}else{
				if (val >= item[0].val && val<=item[0].large) {
					return true;
				} else {
					return false;
				}
			}
		},
		handleCurrentChange(val) {
			this.PageNo = val;
			this.ProblemCellList();
		}
	}
};
</script>

<style scoped="scoped">
.table {
	width: 100%;
	height: 70vh;
	overflow: auto;
}


</style>
