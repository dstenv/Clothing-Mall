import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import cart from './modules/cart.js'
import user from './modules/user.js'
import order from './modules/order.js'

export default new Vuex.Store({
	modules: {
		cart,
		user,
		order
	}
})