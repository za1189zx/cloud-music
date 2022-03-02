'use strict'

import http from '@/request'

const api = {
  /**
   * 获取 banner 内容
   * @param {number} type 设备类型，0为 pc
   * @returns {Promise} banners 数组，imageUrl 为图片，targetId 为目标id，targetType: {1: 单曲 song; 10: 专辑 album; 3000: 活动;} url 活动链接
   */
  getBanner: (type = 0) => {
    return http
      .get('/banner', {
        params: {
          type
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 获取推荐歌单
   * @param {number} limit 取出数量，默认30
   * @returns {Promise} result 数组，type = 1，id 为歌单id，name 为标题，copywriter 为标签，picUrl 为背景图，trackNumberUpdateTime 歌单上传时间，playCount 为播放次数，trackCount 为歌曲数量
   */
  getPersonlizedPlayList: (limit = 7) => {
    return http
      .get('/personalized', {
        params: {
          limit
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 获取推荐电台节目
   * @returns {Promise} result 数组，type = 0，id 为电台id，name 为标题，copywriter 为标签，picUrl 为背景图，program 对象为主要内容
   */
  getPersonlizedDjprogram: () => {
    return http.get('/personalized/djprogram').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 获取推荐新歌
   * @param {number} limit 取出数量，默认10
   * @returns {Promise}
   */
  getPersonlizedNewSong: (limit = undefined) => {
    return http
      .get('/personalized/newsong', {
        params: {
          limit
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 获取推荐 mv
   * @returns {Promise}
   */
  getPersonlizedMv: () => {
    return http.get('/personalized/mv').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 获得每日推荐歌单（需要登录）
   * @returns {Promise} 未登录时返回301需要登录;
   * recommend 数组为歌单列表(6组元素)：id 为歌单id，name 为标题，copywriter 为标签，picUrl 为背景图，createTime 为创建时间，trackCount 为歌曲数量，userId 为作者id，creator 为作者详细信息
   */
  getRecommend: () => {
    return http.get('/recommend/resource').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 获得每日推荐歌曲（需要登录）
   * @returns {Promise} 未登录时返回301需要登录;
   * data.dailySongs 数组为歌曲列表：name 为歌名，id 为歌曲id，ar 数组为歌手列表(id, name)，al 为专辑(id, name, picUrl)，reason 为推荐原因
   */
  getRecommendSongs: () => {
    return http.get('/recommend/songs').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 获取首页新碟上架数据
   * @returns {Promise} albums 数组：name 为专辑名，id 为专辑id，company 为发行公司，publishTime 为发行时间戳，size 为歌曲数量，type 为专辑类型，picUrl 为图片地址，artists 数组为歌手对象集合
   */
  getNewestAlbums: () => {
    return http.get('/album/newest').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 获取所有榜单内容摘要
   * @returns {Promise} list 数组下的榜单摘要对象：updateFrequency 为更新频率，name 为榜单名，id 为榜单id，description 为榜单描述，playCount 为播放次数，subscribedCount 为收藏次数，updateTime 为更新的时间戳，
   */
  getToplist: () => {
    return http.get('/toplist/detail').catch(err => {
      throw new Error(err)
    })
  }
}

export default api
