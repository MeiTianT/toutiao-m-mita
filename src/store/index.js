import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象，存储当前登录用户信息data（token等数据）
    user: getItem(TOKEN_KEY)
  },
  getters: {},
  mutations: {
    // 设置用户信息
    setUser (state, data) {
      state.user = data
      // 把数据备份到本地存储，防止刷新丢失
      setItem(TOKEN_KEY, state.user)
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
    }
  },
  actions: {},
  modules: {}
})
