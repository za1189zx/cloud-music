'use strict'

import http from '@/request'

const api = {
  /**
   * 调用此接口, 传入音乐 id, 可获得歌曲详情
   * @param {number} ids 音乐 id (支持多个 id, 用 , 隔开)
   * @returns {Promise}
   */
  getSongDetail: ids => {
    return http.get('/song/detail', {
      params: {
        ids
      }
    })
  },
  /**
   * 调用此接口 , 传入音乐 id 可获得对应音乐的歌词
   * @param {number} id 音乐 id
   * @returns {Promise}
   */
  getLyric: id => {
    return http.get('/lyric', {
      params: {
        id
      }
    })
  },
  /**
   *  调用此接口 , 传入歌曲 id, 可获得相似歌曲
   * @param {number} id 歌曲 id
   * @returns {Promise}
   */
  getSimiSong: id => {
    return http.get('/simi/song', {
      params: {
        id
      }
    })
  },
  /**
   * 调用此接口 , 传入歌曲 id, 可获得相似歌单
   * @param {number} id 歌曲 id
   * @returns {Promise}
   */
  getSimiPlayList: id => {
    return http.get('/simi/playlist', {
      params: {
        id
      }
    })
  }
}

export default api
