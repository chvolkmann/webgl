import * as BABYLON from 'babylonjs'

import * as scene from './scene/index'
import * as camera from './scene/cameras'

export const TIMERS = {
  start: new Date().getTime(),
  lastFrame: new Date().getTime(),
  lastSec: new Date().getTime(),
}

let framesDrawnThisSecond = 0
export let fps: number

let error: Error | null = null

let engine: BABYLON.Engine
let activeScene: BABYLON.Scene
let activeCamera: BABYLON.Camera
let updateFps: (fps: number) => unknown

export function init(
  canvas: HTMLCanvasElement,
  updateFps_: (fps: number) => unknown
) {
  engine = new BABYLON.Engine(canvas, true)
  updateFps = updateFps_
  activeScene = scene.init(engine)
  activeCamera = activeScene.getCameraByName('playerCam')!
  activeCamera.attachControl(canvas, false)
}

export function runRenderLoop() {
  engine.runRenderLoop(() => activeScene.render())
}

export function renderLoop() {
  if (error) {
    console.error(error)
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
    updateFps(fps)
  }

  framesDrawnThisSecond++
  TIMERS.lastFrame = now

  try {
    activeScene.render()
  } catch (err) {
    error = err
  }

  requestAnimationFrame(renderLoop)
}

export function setAspectRatio() {
  engine.resize()
}
