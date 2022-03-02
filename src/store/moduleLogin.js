import api from '@/api'
export const moduleLogin = {
  state: () => ({
    // eslint-disable-next-line no-undef
    realIP: returnCitySN.cip,
    network: true,
    // 是否已登录
    isLogin: false,
    toLogin: false,
    userInfo: null,
    initialized: false
  }),
  getters: {
    avatarUrl(state) {
      if (state.isLogin && state.userInfo) return state.userInfo.avatarUrl
      else return 'https://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg'
    }
  },
  mutations: {
    changeNetwork(state, val) {
      if (state.isLogin === val || typeof val !== 'boolean') return
      state.network = val
    },
    toLogin(state, val) {
      if (state.toLogin === val || typeof val !== 'boolean') return
      state.toLogin = val
    },
    // 缓存用户信息
    setUserInfo(state, info) {
      if (info === null) {
        state.userInfo = null
        state.isLogin = false
        return
      }
      if (state.userInfo && state.userInfo.userId === info.userId) return
      state.userInfo = info
      state.isLogin = true
    },
    initialize(state) {
      state.initialized = true
    }
  },
  actions: {
    async init({ commit }) {
      const { data: res } = await api.getLoginStatus()
      if (res.data.account && res.data.profile) {
        commit('setUserInfo', res.data.profile)
      }
      commit('initialize')
    }
  }
}
