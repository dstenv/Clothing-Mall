export default {
	state: {
		orderId:'',
	},
	getters: {},
	mutations: {
		initOrder(state, orderId) {
			state.orderId = orderId
		}
	},
	actions: {}
}