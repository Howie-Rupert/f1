import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userid: '',
    contectuser: '006',
    haveMessage: '',
  },
  getters: {
    contectuser: state => state.contectuser,
    haveMessage: state => state.haveMessage,
  },
  mutations: {
    SET_USERID(state, e) {
      state.userid = e
    },
    SET_TOUSER(state, e) {
      state.contectuser = e
    },
    SET_MESSAGE(state, e) {
      state.haveMessage = e
    },

  },
  actions: {
  },
  modules: {
  }
})
