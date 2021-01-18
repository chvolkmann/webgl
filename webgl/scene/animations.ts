import * as BABYLON from 'babylonjs'

import Modulation from './modulation'

const modulators: Record<string, Modulation> = {}

export function init(scene: BABYLON.Scene) {
  scene.registerBeforeRender(animate)

  const sphere = scene.getMeshByName('sphere')!
  modulators.wiggle = new Modulation(
    sphere,
    'position.y',
    3,
    0,
    2,
    (p) => -Math.cos(p * 2 * Math.PI) + 1
  )
}

function animate() {
  Object.values(modulators).forEach((m: Modulation) => m.modulate())
}
