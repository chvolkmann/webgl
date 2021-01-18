import * as THREE from 'three'

export const LIGHTS: Record<string, THREE.Light> = {}

export function init(scene: THREE.Scene, cam: THREE.PerspectiveCamera) {
  LIGHTS.ambient_top = new THREE.PointLight().translateY(10)

  LIGHTS.cam = new THREE.SpotLight()
    .translateX(cam.position.x)
    .translateY(cam.position.y)
    .translateZ(cam.position.z)
    .rotateX(cam.rotation.x)
    .rotateY(cam.rotation.y)
    .rotateZ(cam.rotation.z)

  scene.add(...Object.values(LIGHTS))
}
