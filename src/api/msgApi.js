'use strict'

import http from '@/request'

const api = {
  /**
   * 登录后调用此接口 ,可获取私信
   * @param {*} limit 返回数量 , 默认为 30
   * @param {*} offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
   * @returns {Promise}
   */
  getPrivateMsg: (limit = undefined, offset = undefined) => {
    return http.get('/msg/private', {
      params: {
        limit,
        offset
      }
    })
  }
}

export default api
