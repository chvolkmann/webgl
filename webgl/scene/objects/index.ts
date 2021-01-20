import * as BABYLON from 'babylonjs'

import * as WavePlane from './WavePlane'

export function init(scene: BABYLON.Scene) {
  const sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 2, scene, true)
  const mat = new BABYLON.StandardMaterial('standard', scene)
  mat.ambientColor = BABYLON.Color3.Blue()
  mat.diffuseColor = BABYLON.Color3.Red()
  mat.specularColor = BABYLON.Color3.White()
  sphere.material = mat

  addCoordAxes(new BABYLON.Vector3(), new BABYLON.Vector3(), scene, 4)

  const plane = WavePlane.makePlane(scene, {
    width: 20,
    height: 20,
    subdivisons: 100,
    color: BABYLON.Color3.Blue(),
    flat: true,
  })
  // const frame = WavePlane.makeWireframePlane(scene, BABYLON.Color3.White(), {
  //   width: 20,
  //   height: 20,
  //   subdivisons: 100,
  //   color: BABYLON.Color3.Blue(),
  //   flat: true,
  // })
  WavePlane.addWaveyAnimator(plane, {
    totalFrames: 60,
    min: 0,
    max: 1,
    phaseShift: (1 / 180) * Math.PI,
    mod: WavePlane.MOD_PEAK,
  })

  // WavePlane.addWaveyAnimator(frame, {
  //   totalFrames: 60,
  //   min: 0,
  //   max: 2,
  //   phaseShift: (1 / 180) * Math.PI,
  //   mod: WavePlane.MOD_PEAK,
  // })
}

export function addCoordAxes(
  pos: BABYLON.Vector3,
  rot: BABYLON.Vector3,
  scene: BABYLON.Scene,
  size: number
) {
  const makeTextPlane = (text: string, color: string, size: number) => {
    const tex = new BABYLON.DynamicTexture('textTex', 50, scene, true)
    tex.hasAlpha = true
    tex.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true)
    const plane = BABYLON.Mesh.CreatePlane('textPlane', size, scene, true)
    const mat = new BABYLON.StandardMaterial('textPlaneMat', scene)
    mat.backFaceCulling = false
    mat.specularColor = new BABYLON.Color3(0, 0, 0)
    mat.diffuseTexture = tex
    plane.material = mat
    return plane
  }

  const axisX = BABYLON.Mesh.CreateLines('axisX', [
    BABYLON.Vector3.Zero(),
    new BABYLON.Vector3(size, 0, 0),
    new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    new BABYLON.Vector3(size, 0, 0),
    new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
  ])
  axisX.color = BABYLON.Color3.Red()
  const xChar = makeTextPlane('X', 'red', size / 10)
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
  const axisY = BABYLON.Mesh.CreateLines('axisY', [
    BABYLON.Vector3.Zero(),
    new BABYLON.Vector3(0, size, 0),
    new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
    new BABYLON.Vector3(0, size, 0),
    new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
  ])
  axisY.color = new BABYLON.Color3(0, 1, 0)
  const yChar = makeTextPlane('Y', 'green', size / 10)
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)

  const axisZ = BABYLON.Mesh.CreateLines('axisZ', [
    BABYLON.Vector3.Zero(),
    new BABYLON.Vector3(0, 0, size),
    new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
    new BABYLON.Vector3(0, 0, size),
    new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
  ])
  axisZ.color = new BABYLON.Color3(0, 0, 1)
  const zChar = makeTextPlane('Z', 'blue', size / 10)
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
}
