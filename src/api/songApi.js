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
  },
  /**
   * 调用此接口,传入歌曲 id, 可获取音乐是否可用
   * @param {number} id 音乐 id
   * @param {number} br 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
   * @returns {Promise} 返回 { success: true, message: 'ok' } 或者 { success: false, message: '亲爱的,暂无版权' }
   */
  checkMusic: (id, br = undefined) => {
    return http.get('/check/music', {
      params: {
        id,
        br
      }
    })
  },
  /**
   * 调用此接口, 传入音乐 id( 可多个, 用逗号隔开 ), 可以获取对应的音乐的 url, 未登录状态或者非会员返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
   * @param {number} id 音乐 id
   * @param {number} br 码率, 默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
   * @returns {Promise}
   */
  getSongUrl: (id, br = undefined) => {
    return http.get('/song/url', {
      params: {
        id,
        br
      }
    })
  }
}

export default api
