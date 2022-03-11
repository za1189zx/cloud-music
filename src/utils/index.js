export const errorInfo = err => {
  let info = err.toString().replace('Error: ', '')
  if (/timeout/.test(info)) info = '请求超时'
  else if (/Network/.test(info)) info = '网络故障'
  else if (/405/.test(info)) info = '发送验证码间隔过短'
  else {
    console.log(err)
  }
  return info
}

// 用万/亿单位
export const numToUnitWan = (num, n = 4) => {
  if (typeof num !== 'number') return
  if (num < Math.pow(10, n)) return num
  else if (num > 100000000) return Number.parseInt(num / 100000000) + '亿'
  else return Number.parseInt(num / 10000) + '万'
}

export const uniqueFunc = (arr, uniId) => {
  const res = new Map()
  return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1))
}
