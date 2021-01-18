import * as BABYLON from 'babylonjs'

import * as camera from './cameras'
import * as lights from './lights'
import * as environment from './environment'
import * as objects from './objects'

export let scene: BABYLON.Scene

export function init(engine: BABYLON.Engine) {
  scene = new BABYLON.Scene(engine)

  camera.init(scene)
  lights.init(scene)
  environment.init(scene)
  objects.init(scene)

  return scene
}
