import * as BABYLON from 'babylonjs'

interface WavePlaneParams {
  width: number
  height: number
  subdivisons: number
  color?: BABYLON.Color3
  material?: BABYLON.Material
  flat: boolean
}

export const MOD_PEAK = (x: number) => (-Math.cos(x) + 1) / 2

export function makePlane(
  scene: BABYLON.Scene,
  params: Partial<WavePlaneParams>
) {
  const mesh = BABYLON.MeshBuilder.CreateGround('plane', {
    width: params.width,
    height: params.height,
    subdivisions: params.subdivisons,
    updatable: true,
  })
  let mat = params.material
  if (!mat) {
    const mat2 = new BABYLON.StandardMaterial('planeMat', scene)
    mat2.diffuseColor = params.color ?? new BABYLON.Color3(0.5, 0.5, 0.5)
    mat = mat2
  }
  mesh.material = mat

  if (params.flat) mesh.convertToFlatShadedMesh()

  return mesh
}

export function makeWireframePlane(
  scene: BABYLON.Scene,
  color: BABYLON.Color3,
  params: WavePlaneParams
) {
  const mat = new BABYLON.StandardMaterial('wireframePlaneMat', scene)
  mat.diffuseColor = color
  mat.wireframe = true
  params.material = mat
  return makePlane(scene, params)
}

interface WaveAnimationParams {
  totalFrames: number // total number of frames
  min: number // minimum output value
  max: number // maximum output value
  mod: (x: number) => number // maps [0,1] to [0,1], animation progress to output axis
  phaseShift: number
}

export function addWaveyAnimator(
  mesh: BABYLON.Mesh,
  params: WaveAnimationParams
) {
  const pos = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)
  let frame = 0

  mesh.registerBeforeRender(() => {
    // console.log('x')
    const stride = 3
    for (let i = 0; i < pos.length; i += stride) {
      // Update y value
      const frameProgress = frame / params.totalFrames
      let val = params.mod(frameProgress * 2 * Math.PI + i * params.phaseShift)
      val = (params.max - params.min) * val + params.min
      pos[i + 1] = val
    }

    mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos, false, true)

    const normals: any[] = []
    BABYLON.VertexData.ComputeNormals(pos, mesh.getIndices(), normals)
    mesh.updateVerticesData(
      BABYLON.VertexBuffer.NormalKind,
      normals,
      false,
      false
    )

    frame = (frame + 1) % params.totalFrames
  })
}
