<template lang="pug">
.lol
  button.button.is-primary.is-small(@click="onReloadClick") Reload
  hr
  .webgl(ref="root")
    .viewport(ref="viewport")
    .overlay
      p {{ hmr ? 'Waiting for HMR...' : overlayContent }}
      .controls.has-text-right
        b-icon.clickable(
          :key="!reloading ? 'reload' : 'check'"
          :icon="!reloading ? 'reload' : 'check'"
          size="is-small"
          :type="reloading ? 'is-success' : ''"
          @click="onReloadClick"
        )
</template>

<script>
let webgl = null
if (process.browser) webgl = require('@/webgl')

module.hot.addStatusHandler((status) => {
  if (status === 'check' && onHMRStart) onHMRStart()
  else if (status === 'idle' && onHMREnd) onHMREnd()
})

let onHMRStart
let onHMREnd

const component = {
  name: 'WebGL',
  data: () => ({
    hmr: false,
    overlayContent: '',
    mouseOverIcon: false,
    reloading: false,
  }),
  created() {
    onHMRStart = () => {
      this.hmr = true
    }
    onHMREnd = () => (this.hmr = false)
    window.addEventListener(
      'resize',
      () => {
        if (this.$refs.viewport) {
          const style = window.getComputedStyle(this.$refs.viewport)
          const parsePx = (str) => parseFloat(str.slice(0, -2))
          webgl.setAspectRatio(parsePx(style.width), parsePx(style.height))
        }
      },
      false
    )
  },
  mounted() {
    this.reload()
    this.$refs.viewport.focus()
  },
  methods: {
    onReloadClick() {
      this.reloading = true
      this.reload()
      setTimeout(() => (this.reloading = false), 1000)
    },
    reload() {
      console.clear()
      webgl.init(this.$refs.viewport, (x) => (this.overlayContent = x))
      webgl.renderLoop()
    },
  },
}
export default component
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

    .controls .clickable
      cursor: pointer
      pointer-events: all
      &:hover
        color: teal
</style>
