<template lang="pug">
div
  .btns(style="display: flex; justify-content: center; align-items: center")
    b-button(
      type="is-info"
      icon-left="reload"
      outlined
      :loading="reloading"
      @click="onReloadClick"
    )
    b-button(
      type="is-success"
      :outlined="rendering"
      :icon-left="rendering ? 'stop' : 'play'"
      @click="(...args) => rendering ? stopRendering(...args) : startRendering(...args)"
    )
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
import LOGS from '@/util/logging'

let moment
if (process.browser) moment = require('moment')

let webgl
if (process.browser) webgl = require('@/webgl')

function hmrStatusHandler(status) {
  LOGS.lifecycle.info(status)
  if (status === 'check' && onHMRStart) onHMRStart()
  else if (status === 'idle' && onHMREnd) onHMREnd()
}

let hmrHandlerAdded = false
if (!hmrHandlerAdded) {
  hmrHandlerAdded = true
  LOGS.lifecycle.debug('Injecting HMR hooks')
  module.hot.addStatusHandler(hmrStatusHandler)
}
module.hot.removeStatusHandler(hmrStatusHandler)

// Handlers set by the Vue component
let onHMRStart
let onHMREnd

export default {
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
    LOGS.lifecycle.debug('Vue Component created')
    onHMRStart = () => {
      LOGS.lifecycle.warn('HMR starting')
      this.hmr = true
      this.destroyContext()
    }
    onHMREnd = () => {
      // console.clear()
      LOGS.lifecycle.warn('HMR finisshssssefd')
      this.hmr = false
      // this.attach()
      // if (this.rendering) this.startRendering()
    }
    if (window) {
      window.addEventListener('resize', () => this.updateAspectRatio(), false)
    }

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
      LOGS.lifecycle.debug('Vue Component mounted')
      await this.attach()

      this.startRendering()
    } catch (err) {
      LOGS.lifecycle.error('Error attaching during mount', err)
    }
  },
  beforeDestroy() {
    LOGS.lifecycle.debug('Destroying Vue Component')
    this.destroyContext()
  },
  methods: {
    async attach() {
      return new Promise(async (resolve) => {
        if (this.$refs.viewport) {
          LOGS.lifecycle.debug('WebGL renderer attached')
          await this.reload()
          this.$refs.viewport.focus()
          resolve()
        } else {
          await this.$nextTick()
          resolve(await this.attach())
        }
      })
    },
    destroyContext() {
      this.stopRendering()
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
    async onReloadClick() {
      LOGS.main.debug('Clicked on Reload')
      this.reloading = true

      const currentlyRendering = !!this.rendering
      await this.reload()
      if (currentlyRendering) this.startRendering()
      setTimeout(() => (this.reloading = false), 1000)
    },
    getCanvas() {
      return document.querySelector('canvas.viewport')
    },
    async reload() {
      // console.clear()
      LOGS.lifecycle.info('Reloading')
      this.destroyContext()
      webgl.mount(this.getCanvas())
      // input.init(navigator)
      // input.scan()
      this.updateAspectRatio()
      this.lastReload = moment()
    },
    startRendering() {
      LOGS.main.debug('Starting rendering loop')
      this.rendering = true
      webgl.startRendering()
    },
    stopRendering() {
      LOGS.main.debug('Stopping rendering loop')
      this.rendering = false
      webgl.stopRendering()
    },
  },
}
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
