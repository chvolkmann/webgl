<template lang="pug">
.lol
  button.button.is-primary.is-small(@click="onReloadClick") Reload
  small &nbsp; {{ elapsedTime }}
  hr
  .webgl(ref="root")
    canvas.viewport(ref="viewport")
    .overlay
      p
        span(v-if="hmr") Waiting for HMR...
        span(v-else) {{ fps }} FPS
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
let moment
if (process.browser) moment = require('moment')

let webgl
if (process.browser) webgl = require('@/webgl')

let input
if (process.browser) input = require('@/webgl/input/vr')

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
    fps: 0,
    mouseOverIcon: false,
    reloading: false,
    lastReload: moment(),
    lastReloadStrTimer: null,
    elapsedTime: null,
  }),
  created() {
    onHMRStart = () => {
      this.hmr = true
      this.attach()
    }
    onHMREnd = () => (this.hmr = false)
    window.addEventListener('resize', () => this.updateAspectRatio(), false)

    this.elapsedTime = moment
      .duration(this.lastReload.diff(moment()))
      .humanize(true)
    this.lastReloadStrTimer = setInterval(() => {
      this.elapsedTime = moment
        .duration(this.lastReload.diff(moment()))
        .humanize(true)
    }, 1000)
  },
  mounted() {
    this.attach()
  },
  methods: {
    attach() {
      if (this.$refs.viewport) {
        this.$refs.viewport.focus()
        this.reload()
      } else this.$nextTick(() => this.attach())
    },
    updateAspectRatio() {
      if (this.$refs.viewport) webgl.setAspectRatio(...this.getAspectRatio())
    },
    getAspectRatio() {
      if (!this.$refs.viewport) return
      const style = window.getComputedStyle(this.$refs.viewport)
      const parsePx = (str) => parseFloat(str.slice(0, -2))
      return [parsePx(style.width), parsePx(style.height)]
    },
    onReloadClick() {
      this.reloading = true
      this.reload()
      setTimeout(() => (this.reloading = false), 1000)
    },
    reload() {
      console.clear()
      webgl.init(this.$refs.viewport, (fps) => (this.fps = fps))
      input.init(navigator)
      input.scan()
      this.updateAspectRatio()
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
