import * as BABYLON from 'babylonjs'

import * as camera from './cameras'
import * as lights from './lights'
import * as environment from './environment'
import * as objects from './objects/index'
import * as animations from './animations'

export let scene: BABYLON.Scene

export function init(engine: BABYLON.Engine) {
  scene = new BABYLON.Scene(engine)
  scene.ambientColor = new BABYLON.Color3(1, 1, 1)

  camera.init(scene)
  lights.init(scene)
  environment.init(scene)
  objects.init(scene)

  animations.init(scene)

  return scene
}
