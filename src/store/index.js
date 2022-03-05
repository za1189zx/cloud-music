import { createStore } from 'vuex'
import { moduleLogin } from './moduleLogin'
import { moduleDiscover } from './moduleDiscover'
import { moduleComment } from './moduleComment'
import { moduleMsg } from './moduleMsg'

moduleLogin.modules = {
  moduleDiscover,
  moduleComment,
  moduleMsg
}

export default createStore(moduleLogin)
