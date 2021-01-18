import * as BABYLON from 'babylonjs'

import * as scene from './scene/index'
import * as camera from './scene/cameras'

export const TIMERS = {
  start: new Date().getTime(),
  lastFrame: new Date().getTime(),
  lastSec: new Date().getTime(),
}

let engine: BABYLON.Engine
let activeScene: BABYLON.Scene
let activeCamera: BABYLON.Camera
export function init(canvas: HTMLCanvasElement) {
  engine = new BABYLON.Engine(canvas, true)
  activeScene = scene.init(engine)
  activeScene.getCameraByName('playerCam')!.attachControl(canvas, false)
}

export function runRenderLoop() {
  engine.runRenderLoop(() => activeScene.render())
}

export function getFPS() {
  return engine?.getFps()
}

export function destroy() {
  if (engine) {
    engine.stopRenderLoop()
    engine.dispose()
  }
}

export function setAspectRatio() {
  engine.resize()
}
