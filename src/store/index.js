import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userid:''
  },
  getters: {
  },
  mutations: {
    SET_USERID(state,e){
      state.userid = e
    }
  },
  actions: {
  },
  modules: {
  }
})
