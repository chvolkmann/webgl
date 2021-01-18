<template lang="pug">
.webgl
  .viewport(ref="viewport")
  .overlay {{ overlayContent }}
</template>

<script>
let webgl = null
if (process.browser) webgl = require('@/webgl')

export default {
  name: 'WebGL',
  data: () => ({
    overlayContent: '',
  }),
  mounted() {
    webgl.registerListeners(window)
    this.reload()
  },
  methods: {
    reload() {
      console.log(webgl)
      webgl.init(this.$refs.viewport, (x) => (this.overlayContent = x))
      webgl.renderLoop()
    },
  },
}
</script>

<style lang="sass" scoped>
.webgl
  width: 75vw
  height: 75vh
  position: relative
  margin: 0
  padding: 0

  .viewport, .overlay
    width: 100%
    height: 100%
    position: absolute
    top: 0
    bottom: 0
    z-index: 0
    margin: 0
    padding: 0

  .overlay
    z-index: 100
    pointer-events: none
    text-align: right
    padding: 2px 5px
</style>
