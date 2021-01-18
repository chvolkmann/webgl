import * as THREE from 'three'

import * as camera from './cameras'
import * as lights from './lights'
import * as environment from './environment'
import * as objects from './objects'

export let scene: THREE.Scene

export function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  camera.init(scene)
  lights.init(scene, camera.get())
  environment.init(scene)
  objects.init(scene)

  return scene
}
