import api from '@/api'
export const moduleMsg = {
  state: () => ({
    privateMsg: null
  }),
  getters: {
    atList: state => {
      if (state.privateMsg) return state.privateMsg.filter(item => item.fromUser.artistName).map(item => item.fromUser.nickname)
    }
  },
  mutations: {
    privateMsg(state, payloads) {
      state.privateMsg = payloads
    }
  },
  actions: {
    async initMsg({ commit }) {
      const { data: res } = await api.getPrivateMsg()
      if (res.code === 200 && res.msgs && res.msgs.length) {
        commit('privateMsg', res.msgs)
      }
    }
  }
}
