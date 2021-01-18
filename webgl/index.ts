import * as THREE from 'three'
import THREEOrbitControls from 'three-orbit-controls'

import * as renderer from './renderer'
import * as scene from './scene/index'
import * as camera from './scene/cameras'

const OrbitControls = THREEOrbitControls(THREE)

export let CONTROLS: InstanceType<typeof OrbitControls>

function initControls(cam: THREE.PerspectiveCamera, rendererDomNode: Element) {
  CONTROLS = new OrbitControls(cam, rendererDomNode)
  // controls.maxPolerAngle = Math.PI / 2
  // controls.minDistance = 1
  // constrols.
}

export const TIMERS = {
  start: new Date().getTime(),
  lastFrame: new Date().getTime(),
  lastSec: new Date().getTime(),
}

let framesDrawnThisSecond = 0
export let fps: number

let error: Error | null = null

let RENDERER: THREE.Renderer
let activeScene: THREE.Scene
let activeCamera: THREE.PerspectiveCamera
let overlay: (x: string) => unknown

export function init(canvas: Element, overlay_: (x: string) => unknown) {
  RENDERER = renderer.init(canvas)
  overlay = overlay_
  activeScene = scene.init()
  activeCamera = camera.get('player')
  initControls(activeCamera, RENDERER.domElement)
}

export function renderLoop() {
  if (error) {
    console.error(error)
    overlay(error.toString())
    return
  }

  const now = new Date().getTime()

  const elapsedSecs = (now - TIMERS.start) / 1000
  const deltaMs = now - TIMERS.lastFrame

  if ((now - TIMERS.lastSec) / 1000 >= 1.0) {
    const fps = framesDrawnThisSecond
    framesDrawnThisSecond = 0
    // round to seconds
    TIMERS.lastSec = Math.floor(now / 1000) * 1000
    overlay(`${fps} FPS`)
  }

  framesDrawnThisSecond++
  TIMERS.lastFrame = now

  try {
    RENDERER.render(activeScene, activeCamera)
  } catch (err) {
    error = err
  }

  requestAnimationFrame(renderLoop)
}

export function registerListeners(window: Window) {
  window.addEventListener('resize', renderer.onWindowResize)
  window.addEventListener('resize', camera.onWindowResize)
}
