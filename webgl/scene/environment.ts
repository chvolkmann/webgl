import * as THREE from 'three'

export let gridplane: ReturnType<typeof initGridPlane>

export function initGridPlane(
  scene: THREE.Scene,
  width: number = 2000,
  height: number = 2000
) {
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(width, height).rotateX(-Math.PI / 2),
    new THREE.ShadowMaterial({ opacity: 0.2 })
  )
  plane.receiveShadow = true
  scene.add(plane)

  const helper = new THREE.GridHelper(width, height)
  // helper.material.opacity = 0.25;
  // helper.material.transparent = true;
  scene.add(helper)

  return {
    plane,
    helper,
  }
}

export function init(scene: THREE.Scene) {
  initGridPlane(scene)
}
