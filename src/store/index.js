import { createStore } from 'vuex'
import { moduleLogin } from './moduleLogin'
import { moduleDiscover } from './moduleDiscover'
import { moduleComment } from './moduleComment'

moduleLogin.modules = {
  moduleDiscover,
  moduleComment
}

export default createStore(moduleLogin)
