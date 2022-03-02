'use strict'

import http from '@/request'

const api = {
  /**
   * 登录后调用此接口 , 传入用户 id, 可以获取用户关注列表
   * @param {number} uid 用户 id
   * @param {number} limit 返回数量 , 默认为 30
   * @param {number} offset 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
   * @returns {Promise}
   */
  getUserFollows: (uid, limit = undefined, offset = undefined) => {
    return http
      .get('/comment/playlist', {
        params: {
          uid,
          limit,
          offset
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  }
}

export default api
