'use strict'

import loginApi from './loginApi'
import discoverApi from './discoverApi'
import playlistApi from './playlistApi'
import commentApi from './commentApi'
import userApi from './userApi'
import msgApi from './msgApi'
import songApi from './songApi'

const api = {
  ...loginApi,
  ...discoverApi,
  ...playlistApi,
  ...commentApi,
  ...userApi,
  ...msgApi,
  ...songApi
}

export default api
