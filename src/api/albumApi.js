'use strict'

import http from '@/request'

const api = {
  /**
   * 获取专辑内容
   * @param {number} id 专辑 id
   * @returns
   */
  getAlbum: id => {
    return http.get('/album', {
      params: {
        id
      }
    })
  },
  /**
   * 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
   * @param {number} id 歌手 id
   * @param {number} limit 取出数量 , 默认为 50
   * @param {number} offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
   * @returns
   */
  getArtistAlbum: (id, limit = undefined, offset = undefined) => {
    return http.get('/artist/album', {
      params: {
        id,
        limit,
        offset: offset ? (offset - 1) * (limit || 50) : undefined
      }
    })
  },
  /**
   * 调用此接口,可收藏/取消收藏专辑
   * @param {number} id 专辑 id
   * @param {number} t 1 为收藏,其他为取消收藏
   * @returns
   */
  subAlbum: (id, t = undefined) => {
    return http.get('/album/sub', {
      params: {
        id,
        t
      }
    })
  }
}

export default api
