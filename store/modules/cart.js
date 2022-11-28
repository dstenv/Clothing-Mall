export default {
	state: {
		list: [],
		selected: [],
		changeList: []
	},
	getters: {
		// 是否被全选
		isCheckAll(state) {
			return state.list.length === state.selected.length
		},
		controlData(state) {
			let total = 0
			let num = 0
			total = state.list.reduce((a,b) => {
				if(b.checked) {
					num++
					return a + b.pprice * parseInt(b.count)
				}
				return a
			},total)
			return {
				total,
				num
			}
		}
	},
	mutations: {
		// 赋初值
		setList(state,list) {
			state.list = list
		},
		
		// 全选
		selectAll(state) {
			state.selected = state.list.map(v => {
				v.checked = true
				return v.id
			})
		},
		
		// 全不选
		unSelectAll(state) {
			state.list.forEach(v => {
				v.checked = false
			})
			state.selected = []
		},
		
		// 选择单个
		selectItem(state,index) {
			let id = state.list[index].id
			let haveIndex = state.selected.indexOf(id)
			if(haveIndex == -1) {
				state.list[index].checked = true
				state.selected.push(id)
			}else {
				state.list[index].checked = false
				state.selected.splice(haveIndex,1)
			}
		},
		
		// 修改list数组某一项的某个属性值
		changeListItem(state,{index,key,value}) {
			console.log(index,key,value)
			if(Object.keys(state.list[index]).indexOf(key)) {
				state.list[index][key] = value
			}
		},
		
		// 删除
		deleteGood(state) {
			state.selected = []
		}
	},
	actions: {
		checkAll({commit, getters}) {
			getters.isCheckAll? commit('unSelectAll'):commit('selectAll')
		},
		// deleteGoodAct({commit}) {
		// 	commit('deleteGood')
		// 	uni.showToast({
		// 		title:'删除成功'
		// 	})
		// }
	}
}