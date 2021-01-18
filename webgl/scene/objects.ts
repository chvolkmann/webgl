import * as BABYLON from 'babylonjs'

const OBJECTS: Record<string, BABYLON.Mesh> = {}

export function init(scene: BABYLON.Scene) {
  BABYLON.Mesh.CreateSphere('sphere', 16, 2, scene)
}
