'use strict'

import loginApi from './loginApi'
import discoverApi from './discoverApi'
import playlistApi from './playlistApi'
import commentApi from './commentApi'
import userApi from './userApi'

const api = {
  ...loginApi,
  ...discoverApi,
  ...playlistApi,
  ...commentApi,
  ...userApi
}

export default api
