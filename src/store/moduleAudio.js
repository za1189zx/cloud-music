import { uniqueFunc } from '@/utils'

export const moduleAudio = {
  state: () => ({
    tracks: JSON.parse(window.localStorage.getItem('tracks') || null),
    toPlayId: 0
  }),
  mutations: {
    resetAudioTracks(state, tracks) {
      state.tracks = tracks.filter(item => !item.disabled)
      window.localStorage.setItem('tracks', JSON.stringify(state.tracks))
    },
    addAudioTracks(state, tracks) {
      if (!state.tracks) {
        state.tracks = tracks.filter(item => !item.disabled)
        window.localStorage.setItem('tracks', JSON.stringify(state.tracks))
        return
      }
      state.tracks = uniqueFunc(state.tracks.concat(tracks.filter(item => !item.disabled)), 'id')
      window.localStorage.setItem('tracks', JSON.stringify(state.tracks))
    },
    cleanTracks(state) {
      state.tracks = null
      window.localStorage.removeItem('tracks')
    },
    removeSongfromTracks(state, id) {
      state.tracks = state.tracks.filter(item => item.id !== id)
      window.localStorage.setItem('tracks', JSON.stringify(state.tracks))
    },
    toPlay(state, id = 0) {
      if (id === 'first') id = state.tracks[0].id
      state.toPlayId = id
    }
  }
}
