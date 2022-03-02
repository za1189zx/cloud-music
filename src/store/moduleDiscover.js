import api from '@/api'

export const moduleDiscover = {
  state: () => ({
    // 推荐
    recommends: {
      // 推荐电台节目
      personlizedDjprogram: null,
      // 推荐歌单
      personlizedPlayList: null,
      // 每日推荐歌单(需登录)
      recommendsList: null,
      // 未登录的热门推荐
      list: null,
      // 已登录的列热门推荐
      registerList: null,
      // 小屏幕的热门推荐
      miniList: null,
      // 是否已在登录时请求过
      regi: false,
      // 是否请求过
      got: false
    },
    // 每日推荐歌曲(需登录)
    dailySongs: null,
    // 首页新碟上架
    newestAlbums: null,
    // 榜单
    toplist: null,
    // 首页榜单海报
    toplistBill: null,
    // 最新音乐
    newestSongs: null
  }),
  getters: {
    list(state, _getters, rootState) {
      if (!state.recommends.got) return []
      else if (rootState.isLogin) {
        return state.recommends.registerList
      } else return state.recommends.list
    },
    miniList(state) {
      if (!state.recommends.got) return []
      else return state.recommends.personlizedPlayList.slice(0, 6)
    }
  },
  mutations: {
    setRecommends(state, payloads) {
      // 推荐电台节目
      if (payloads[0]) state.recommends.personlizedDjprogram = payloads[0]
      // 推荐歌单
      if (payloads[1]) {
        state.recommends.personlizedPlayList = payloads[1]
        const list = payloads[1].slice(0, 7)
        list.splice(4, 0, state.recommends.personlizedDjprogram[0])
        list.splice(6, 0, state.recommends.personlizedDjprogram[1])
        list.push(state.recommends.personlizedDjprogram[2])
        state.recommends.list = list
      }
      // 每日推荐歌单(需登录)
      if (payloads[2]) {
        state.recommends.recommendsList = payloads[2]
        state.recommends.regi = true
        const registerList = [{ id: 'taste', copywriter: '根据你的口味生成，每天6:00更新', name: '每日歌曲推荐' }].concat(
          payloads[2].slice(0, 6)
        )
        if (state.recommends.regi && registerList.length < 7) {
          registerList.concat(state.recommends.personlizedPlayList.slice(7 - registerList.length))
        }
        registerList.splice(4, 0, state.recommends.personlizedDjprogram[0])
        registerList.splice(6, 0, state.recommends.personlizedDjprogram[1])
        registerList.push(state.recommends.personlizedDjprogram[2])
        state.recommends.registerList = registerList
      }

      state.recommends.got = true
    },
    resetRegisterList(state) {
      state.recommends.registerList = null
      state.recommends.regi = false
    },
    setDailySongs(state, info) {
      state.dailySongs = info
    },
    setNewestAlbums(state, info) {
      state.newestAlbums = info
    },
    setToplist(state, { list, toplistBill }) {
      state.toplist = list
      state.toplistBill = toplistBill
    },
    setNewestSongs(state, info) {
      state.newestSongs = info
    }
  },
  actions: {
    async recommends({ state, commit, rootState }) {
      const payloads = [null, null, null]
      let res1
      let res2
      let res3

      if (rootState.isLogin && !state.recommends.got) {
        ;[{ data: res1 }, { data: res2 }, { data: res3 }] = await Promise.all([
          api.getPersonlizedDjprogram(),
          api.getPersonlizedPlayList(),
          api.getRecommend()
        ])
      } else if (rootState.isLogin && !state.recommends.regi) {
        ;({ data: res3 } = await api.getRecommend())
      } else if (!rootState.isLogin && !state.recommends.got) {
        ;[{ data: res1 }, { data: res2 }] = await Promise.all([api.getPersonlizedDjprogram(), api.getPersonlizedPlayList()])
      } else if (!rootState.isLogin && state.recommends.got) {
        commit('resetRegisterList')
        return
      } else return
      // 推荐电台节目
      if (res1 && res1.code === 200 && res1.result) payloads[0] = res1.result
      // 推荐歌单
      if (res2 && res2.code === 200 && res2.result) payloads[1] = res2.result
      // 每日推荐歌单(需登录)
      if (res3 && res3.code === 200 && res3.recommend) payloads[2] = res3.recommend

      if (payloads.some(item => item !== null)) commit('setRecommends', payloads)

      // 每日推荐歌曲(需登录)
      if (rootState.isLogin) {
        const { data: res4 } = await api.getRecommendSongs()
        if (res4.code === 200 && res4.data.dailySongs) commit('setDailySongs', res4.data.dailySongs)
      }
    },
    async newestAlbums({ commit }) {
      const { data: res } = await api.getNewestAlbums()
      if (res.code === 200) {
        commit('setNewestAlbums', res.albums.slice(0, 10))
      }
    },
    async toplist({ commit }) {
      const { data: res } = await api.getToplist()
      if (res.code === 200) {
        const list = res.list
        const toplistBill = [
          { name: res.list[0].name, coverImgUrl: `${res.list[0].coverImgUrl}?param=200y200`, tracks: null },
          { name: res.list[1].name, coverImgUrl: `${res.list[1].coverImgUrl}?param=200y200`, tracks: null },
          { name: res.list[2].name, coverImgUrl: `${res.list[2].coverImgUrl}?param=200y200`, tracks: null }
        ]

        const result = await Promise.all([
          api.getPlaylistDetail(res.list[0].id),
          api.getPlaylistDetail(res.list[1].id),
          api.getPlaylistDetail(res.list[2].id)
        ])

        toplistBill.forEach((item, index) => {
          item.tracks = result[index].data.playlist.tracks.slice(0, 10)
        })

        commit('setToplist', { list, toplistBill })
      }
    },
    async newestSongs({ commit }) {
      const { data: res } = await api.getPersonlizedNewSong()
      if (res.code === 200) {
        commit('setNewestSongs', res.result)
      }
    }
  }
}
