import * as BABYLON from 'babylonjs'
import { imageProcessingFunctions } from 'babylonjs/Shaders/ShadersInclude/imageProcessingFunctions'

export function init(scene: BABYLON.Scene) {
  const height = 10
  const width = 10
  const segments = 10

  const ground = BABYLON.Mesh.CreateGround(
    'ground',
    width,
    height,
    segments,
    scene,
    true
  )
  const gmat = new BABYLON.StandardMaterial('gmat', scene)
  gmat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8)
  ground.material = gmat
  ground.convertToFlatShadedMesh()

  const ground2 = BABYLON.Mesh.CreateGround(
    'ground2',
    width,
    height,
    segments,
    scene,
    true
  )
  const gmat2 = new BABYLON.StandardMaterial('gmat2', scene)
  gmat2.diffuseColor = new BABYLON.Color3(1, 1, 1)
  gmat2.wireframe = true
  ground2.material = gmat2
  ground2.convertToFlatShadedMesh()

  const positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind)
  const totalFrames = 60

  const scaleTo = (x: number, min: number, max: number) => (max - min) * x + min
  const waveMod = (p: number) => -Math.cos(p * 2 * Math.PI)

  const min = 0
  const max = 10
  const mod = (p: number, i: number) =>
    scaleTo(waveMod(p + i * 2 * Math.PI), min, max)

  let counter = 0
  ground.registerBeforeRender(() => {
    const p = counter / totalFrames
    const posNew = positions.map((x: number, i: number) => mod(p, i))
    ground.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      posNew,
      false,
      true
    )
    ground2.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      posNew,
      false,
      true
    )
    counter++
  })
}
