import * as THREE from 'three'

export let VIEWPORT_ASPECT_RATIO = window.innerWidth / window.innerHeight

type Vec3 = [number, number, number]
// type Vec4 = [number, number, number, number];

type CameraName = 'player' | 'top'
export const CAMS: Record<CameraName, THREE.PerspectiveCamera> = <any>{}

export function get(name?: CameraName) {
  if (!name) name = 'player'
  return CAMS[name]
}

export const DEFAULT_FOV = 75
export const DEFAULT_NEAR = 1
export const DEFAULT_FAR = 1000

export const DEFAULT_POSITION: Vec3 = [0, 5, -10]

export const makeDefaultCam = () =>
  new THREE.PerspectiveCamera(
    DEFAULT_FOV,
    VIEWPORT_ASPECT_RATIO,
    DEFAULT_NEAR,
    DEFAULT_FAR
  )

export function init(scene: THREE.Scene) {
  CAMS.player = makeDefaultCam()
  CAMS.player.translateX(DEFAULT_POSITION[0])
  CAMS.player.translateY(DEFAULT_POSITION[1])
  CAMS.player.translateZ(DEFAULT_POSITION[2])
  CAMS.player.lookAt(0, 0, 0)

  const spot = new THREE.SpotLight()
    .translateX(CAMS.player.position.x)
    .translateY(CAMS.player.position.y)
    .translateZ(CAMS.player.position.z)
    .rotateX(CAMS.player.rotation.x)
    .rotateY(CAMS.player.rotation.y)
    .rotateZ(CAMS.player.rotation.z)
  CAMS.player.add(spot)

  CAMS.top = makeDefaultCam()
  CAMS.top.translateY(10)
  CAMS.top.lookAt(0, 0, 0)

  scene.add(...Object.values(CAMS))
}

export function moveTo(xyz: Vec3) {
  CAMS.player.position.set(...xyz)
}

export function lookAt(xyz: Vec3) {
  CAMS.player.lookAt(...xyz)
}

export function lookTo(direction: Vec3) {
  CAMS.player.rotation.set(...direction)
}

export function setAspectRatio(width: number, height: number) {
  if (CAMS.player) {
    CAMS.player.aspect = width / height
    CAMS.player.updateProjectionMatrix()
  }
}
