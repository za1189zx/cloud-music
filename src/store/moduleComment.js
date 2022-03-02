export const moduleComment = {
  state: () => ({
    replyFlag: true
  }),
  mutations: {
    replyFlag(state, val) {
      if (state.replyFlag === val) return false
      else state.replyFlag = val
    }
  }
}
