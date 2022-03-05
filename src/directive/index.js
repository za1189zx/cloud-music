export default {
  install(app) {
    // app.directive('focus', {})
    app.directive('clickoutside', {
      mounted(el, binding) {
        function documentHandler(e) {
          let target
          if (binding.modifiers.parent) target = el.parentNode
          else target = el
          if (target.contains(e.target)) {
            return false
          }
          if (binding.value) {
            binding.value(e)
          }
        }
        el.__vueMouseupOutside__ = documentHandler
        document.addEventListener('mouseup', documentHandler)
      },
      unmounted(el) {
        // 解除事件监听
        document.removeEventListener('mouseup', el.__vueMouseupOutside__)
        delete el.__vueMouseupOutside__
      }
    })
  }
}
