import * as BABYLON from 'babylonjs'
import LOGS from '@/util/logging'
import * as SCENE from './scene/index'

const logger = LOGS.webgl

let isRendering = false

let engine: BABYLON.Engine
let scene: BABYLON.Scene

export function mount(canvas: HTMLCanvasElement) {
  engine = new BABYLON.Engine(canvas, true)
  scene = SCENE.init(engine)
  scene.getCameraByName('playerCam')!.attachControl(canvas, false)
  logger.info('Rendering engine mounted')
}

export function startRendering() {
  if (!engine) throw new Error('Engine not initialized')
  if (!isRendering) {
    logger.info('Starting render roop')
    isRendering = true
    engine.runRenderLoop(() => scene.render())
  }
}
export function stopRendering() {
  if (engine && isRendering) {
    logger.info('Stopping render loop')
    isRendering = false
    engine.stopRenderLoop()
  }
}

export function destroy() {
  if (engine) {
    stopRendering()
    engine.dispose()
    engine = null
    logger.info('Engine destroyed')
  }
}

export function getFPS() {
  return engine?.getFps()
}

export function setAspectRatio() {
  engine?.resize()
}
