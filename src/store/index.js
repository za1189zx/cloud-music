import { createStore } from 'vuex'
import { moduleLogin } from './moduleLogin'
import { moduleDiscover } from './moduleDiscover'
import { moduleComment } from './moduleComment'
import { moduleMsg } from './moduleMsg'
import { moduleAudio } from './moduleAudio'

moduleLogin.modules = {
  moduleDiscover,
  moduleComment,
  moduleMsg,
  moduleAudio
}

export default createStore(moduleLogin)
