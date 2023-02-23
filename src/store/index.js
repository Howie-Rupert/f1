import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userid: '',
    contectuser: '006',
  },
  getters: {
    contectuser: state => state.contectuser,

  },
  mutations: {
    SET_USERID(state, e) {
      state.userid = e
    },
    SET_TOUSER(state, e) {
      state.contectuser = e
    }
  },
  actions: {
  },
  modules: {
  }
})
