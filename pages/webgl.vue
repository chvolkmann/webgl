<template lang="pug">
div
  .btns(style="display: flex; justify-content: center; align-items: center")
    button.button.is-primary.is-small(@click="onReloadClick") Reload
    template
      button.button.is-success.is-small.is-outlined(v-if="rendering" @click="stopRenderLoop") Rendering
      button.button.is-success.is-small(v-else @click="startRenderLoop") Render
    small {{ elapsedTime }}
  hr
  .webgl(ref="root")
    canvas.viewport(ref="viewport")
    .overlay
      p
        span(v-if="hmr") Waiting for HMR...
        span(v-else) {{ fps ? fps.toFixed(0) : '?' }} FPS
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
    fpsPollTimer: null,
    rendering: true,
  }),
  created() {
    onHMRStart = () => {
      this.hmr = true
      this.destroy()
    }
    onHMREnd = () => {
      this.hmr = false
      this.attach()
    }
    window.addEventListener('resize', () => this.updateAspectRatio(), false)

    this.elapsedTime = moment
      .duration((this.lastReload ?? moment()).diff(moment()))
      .humanize(true)
    this.lastReloadStrTimer = setInterval(() => {
      this.elapsedTime = moment
        .duration((this.lastReload ?? moment()).diff(moment()))
        .humanize(true)
    }, 1000)

    this.fpsPollTimer = setInterval(() => (this.fps = webgl.getFPS()), 1000)
  },
  async mounted() {
    try {
      await this.attach()
      if (this.rendering) this.startRenderLoop()
      console.log('Attached Babylon Context!')
    } catch (err) {
      console.error('Error attaching during mount', err)
    }
  },
  methods: {
    async attach() {
      return new Promise(async (resolve) => {
        if (this.$refs.viewport) {
          this.$refs.viewport.focus()
          await this.reload()
          resolve()
        } else {
          await this.$nextTick()
          resolve(await this.attach())
        }
      })
    },
    destroy() {
      this.stopRenderLoop()
      webgl.destroy()
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
    getCanvas() {
      return document.querySelector('canvas.viewport')
    },
    async reload() {
      console.clear()
      this.destroy()
      webgl.init(this.getCanvas())
      // input.init(navigator)
      // input.scan()
      this.updateAspectRatio()
    },
    startRenderLoop() {
      this.rendering = true
      webgl.runRenderLoop()
    },
    stopRenderLoop() {
      this.rendering = false
      webgl.stopRenderLoop()
    },
  },
}
export default component
</script>

<style lang="sass" scoped>
.button
  &:focus, &.is-focus
    background-color: inherit
    color: inherit
    border-color: inherit

.btns
  padding-top: 20px
  display: flex
  flex-direction: row
  > *
    margin-left: 10px
    &:first-child
      margin-left: 0

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
