'use strict'

import http from '@/request'

const api = {
  /**
   * 获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，但是返回的 trackIds 是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口获取所有歌曲的详情
   * @param {number} id 歌单的 id，必填
   * @param {number} s 歌单最近的 s 个收藏者
   * @returns {Promise} '../../json/getPlaylistDetail.json'
   */
  getPlaylistDetail: (id, s = undefined) => {
    return http.get('/playlist/detail', {
      params: {
        id,
        s
      }
    })
  },
  /**
   * 调用此接口,传入歌单 id 可获取相关歌单
   * @param {number} id 歌单的 id，必填
   * @returns {Promise} playlists 数组：id; name; coverImgUrl; creator
   */
  getPlaylistRelated: id => {
    return http.get('/related/playlist', {
      params: {
        id
      }
    })
  }
}

export default api
