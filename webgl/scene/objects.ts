import * as THREE from 'three'

const OBJECTS: Record<string, THREE.Object3D> = {}

export function init(scene: THREE.Scene) {
  OBJECTS.ball = new THREE.Mesh(
    new THREE.SphereGeometry(1, 200, 200),
    new THREE.MeshStandardMaterial({ color: 'red' })
  )

  scene.add(...Object.values(OBJECTS))
}
