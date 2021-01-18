import * as BABYLON from 'babylonjs'

export const LIGHTS: Record<string, BABYLON.Light> = {}

export function init(scene: BABYLON.Scene) {
  LIGHTS.ambient_top = new BABYLON.HemisphericLight(
    'ambient_top',
    new BABYLON.Vector3(0, 1, 0),
    scene
  )
}
