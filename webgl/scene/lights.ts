import * as THREE from 'three'

export const LIGHTS: Record<string, THREE.Light> = {}

export function init(scene: THREE.Scene, cam: THREE.PerspectiveCamera) {
  LIGHTS.ambient_top = new THREE.PointLight().translateY(10)
  // scene.add(LIGHTS.amb)

  scene.add(...Object.values(LIGHTS))
}
