import qs from 'qs'
import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'

const http = axios.create({
  // baseURL: 'https://netease-cloud-music-api-za1189zx.vercel.app/',
  baseURL: 'http://localhost:3000/',
  timeout: 10000,
  withCredentials: true
})

http.interceptors.request.use(
  config => {
    // 判断请求的类型
    if (config.method === 'post') {
      // post请求，拼到data里面
      const data = qs.parse(config.data)

      config.data = qs.stringify({
        timerstamp: Date.now(),
        ...data
      })
    } else if (config.method === 'get') {
      // get请求，拼到params里面
      config.params = {
        timerstamp: Date.now(),
        ...config.params
      }
    }
    return config
  },
  error => Promise.reject(error)
)

const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 301:
    case 401:
      Toast('未登录，请先登录')
      store.commit('toLogin', true)
      break
    case 403:
      Toast('登录过期，请重新登录')
      store.commit('setUserInfo', null)
      store.commit('toLogin', true)
      break
    case 509:
      Toast('密码错误超过限制')
      break
    default:
      console.log('errorHandle' + other)
  }
}

http.interceptors.response.use(
  // 请求成功
  res => Promise.resolve(res),
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message || response.data.msg)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default http
