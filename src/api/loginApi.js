'use strict'

import http from '@/request'
import md5 from 'js-md5'

const api = {
  /**
   * 二维码 key 生成接口
   * @returns {Promise} { "data": { "code": 200, "unikey": "二维码的key" }, "code": 200 }
   */
  getQrKey: () => {
    return http.get('/login/qr/key').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 二维码生成接口
   * @param {String} key 通过 getQrKey 方法得到的 unikey
   * @returns {Promise} res.qrimg 为二维码的 base64 编码
   */
  getQrImg: key => {
    return http
      .get('/login/qr/create', {
        params: {
          key,
          qrimg: true
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 二维码检测扫码状态接口
   * @param {String} key 通过 getQrKey 方法得到的 unikey
   * @returns {Promise} 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
   */
  checkQrStatus: key => {
    return http
      .get('/login/qr/check', {
        params: {
          key
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 获取国家编码列表
   * @returns {Promise} 200 成功 则message: 'success', data 为列表集合
   */
  getCtcodeList: () => {
    return http.get('/countries/code/list').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 检测手机号码是否已注册
   * @param {String|Number} countrycode 国家码
   * @param {String|Number} phone 手机号码
   * @returns {Promise} 存在则 exist: 1, 不存在则 exist: -1
   */
  checkPhoneExistence: (countrycode, phone) => {
    return http
      .get('/cellphone/existence/check', {
        params: {
          countrycode,
          phone
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 发送验证码
   * @param {String|Number} ctcode 国家码
   * @param {String|Number} phone 手机号码
   * @returns {Promise} 405 为发送频繁，"message": "发送验证码间隔过短"
   */
  sendCaptcha: (ctcode, phone) => {
    return http
      .get('captcha/sent', {
        params: {
          ctcode,
          phone
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 验证验证码
   * @param {String|Number} ctcode 国家码
   * @param {String|Number} phone 手机号码
   * @param {String|Number} captcha 验证码
   * @returns {Promise} 200 正确时 data: true
   */
  verifyCaptcha: (ctcode, phone, captcha) => {
    return http
      .get('/captcha/verify', {
        params: {
          ctcode,
          phone,
          captcha
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 用验证码登录
   * @param {String|Number} ctcode 国家码
   * @param {String|Number} phone 手机号码
   * @param {String|Number} captcha 验证码
   * @returns {Promise} 502 验证码错误 200 正确时返回 accout、token、profile、binding 和 cookie
   */
  loginByCaptcha: (countrycode, phone, captcha) => {
    return http
      .get('/login/cellphone', {
        params: {
          countrycode,
          phone,
          captcha
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 用密码登录
   * @param {String|Number} ctcode 国家码
   * @param {String|Number} phone 手机号码
   * @param {String|Number} password 密码
   * @returns {Promise} 502 密码错误 200 正确时返回 accout、token、profile、binding 和 cookie
   */
  loginByPassword: (countrycode, phone, password) => {
    return http
      .get('/login/cellphone', {
        params: {
          countrycode,
          phone,
          md5_password: md5(password)
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  },
  /**
   * 刷新登录状态
   * @returns {Promise} 301:需要登录; 200:已登录
   */
  refreshLoginStatus: () => {
    return http.get('/login/refresh').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 获取登录状态
   * @returns {Promise} 200 正确时返回 accout、profile, 未登录则为null
   */
  getLoginStatus: () => {
    return http.get('/login/status').catch(err => {
      throw new Error(err)
    })
  },
  /**
   * 退出登录
   * @returns {Promise} code: 200
   */
  logout: () => {
    return http.get('/logout').catch(err => {
      throw new Error(err)
    })
  }
}
export default api
