import * as BABYLON from 'babylonjs'

export function init(scene: BABYLON.Scene) {
  BABYLON.Mesh.CreateGround('ground', 6, 6, 2, scene)
}
