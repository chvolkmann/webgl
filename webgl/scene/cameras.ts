import * as BABYLON from 'babylonjs'

export function init(scene: BABYLON.Scene) {
  const pos = new BABYLON.Vector3(0, 5, -20)
  const playerCam = new BABYLON.FreeCamera('playerCam', pos, scene)
  playerCam.setTarget(BABYLON.Vector3.Zero())

  // const spot = new BABYLON.SpotLight(
  //   'playerLight',
  //   pos,
  //   pos.scale(-1),
  //   Math.PI,
  //   2,
  //   scene
  // )
}
