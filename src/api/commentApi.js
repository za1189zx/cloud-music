'use strict'

import http from '@/request'

const api = {
  /**
   * 调用此接口获得评论列表
   * @param {number} type 数字, 资源类型, 0: 歌曲; 1: mv; 2: 歌单; 3: 专辑; 4: 电台; 5: 视频;
   * @param {number} id 歌单 id
   * @param {number} offset 偏移数量, 用于分页, 如 :( 评论页数 - 1)*20, 其中 20 为 limit 的值
   * @param {number} limit 取出评论数量, 默认为 20
   * @param {number} before 分页参数, 取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
   * @returns {Promise}
   */
  getComment: (type, id, offset = undefined, limit = undefined, before = undefined) => {
    let url
    switch (type) {
      case 0:
        url = '/comment/music'
        break
      case 1:
        url = '/comment/mv'
        break
      case 2:
        url = '/comment/playlist'
        break
      case 3:
        url = '/comment/album'
        break
      case 4:
        url = '/comment/dj'
        break
      case 5:
        url = '/comment/video'
        break
    }
    return http
      .get(url, {
        params: {
          id,
          offset: offset ? (offset - 1) * (limit || 20) : undefined,
          limit,
          before
        }
      })
      .catch(err => {
        return err
      })
  },
  /**
   * 调用此接口 , 传入 type, 资源 id, 和评论 id cid 和 是否点赞参数 t 即可给对 应评论点赞 ( 需要登录 )
   * @param {number} id 资源 id, 如歌曲 id, mv id
   * @param {number} cid 评论 id
   * @param {number} t 是否点赞, 1 为点赞, 0 为取消点赞
   * @param {number} type 数字, 资源类型, 0: 歌曲; 1: mv; 2: 歌单; 3: 专辑; 4: 电台; 5: 视频; 6: 动态
   * @param {number} threadId 动态点赞不需要传入 id 参数, 需要传入动态的 threadId 参数, threadId 可通过 /event, /user/event 接口获取
   * @returns {Promise}
   */
  likeComment: (id, cid, t, type, threadId = undefined) => {
    return http
      .get('/comment/like', {
        params: {
          id,
          cid,
          t,
          type,
          threadId
        }
      })
      .catch(err => {
        return err
      })
  },
  /**
   * 调用此接口,可发送评论或者删除评论
   * @param {number} id 对应资源 id
   * @param {number} commentId 回复的评论 id (回复评论时必填)
   * @param {number} t 0 删除, 1 发送, 2 回复
   * @param {number} type 数字, 资源类型, 0: 歌曲; 1: mv; 2: 歌单; 3: 专辑; 4: 电台; 5: 视频; 6: 动态
   * @param {string} content 要发送的内容
   * @param {number} threadId 动态发送/删除评论不需要传入 id 参数, 需要传入动态的 threadId 参数, threadId 可通过 /event, /user/event 接口获取
   * @returns {Promise}
   */
  comment: (id, commentId, t, type, content, threadId) => {
    return http
      .get('/comment', {
        params: {
          id,
          commentId,
          t,
          type,
          content,
          threadId
        }
      })
      .catch(err => {
        return err
      })
  }
}

export default api
