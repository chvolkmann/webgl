import * as BABYLON from 'babylonjs'

function makeSpaceyDonutMesh(
  scene: BABYLON.Scene,
  width: number = 10,
  height: number = 10,
  segments: number = 10
) {
  const parent = new BABYLON.TransformNode('spaceyDonut', scene)
  const plane = BABYLON.Mesh.CreateGround(
    'plane',
    width,
    height,
    segments,
    scene,
    true
  )
  const planeMat = new BABYLON.StandardMaterial('planeMat', scene)
  planeMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.8)
  plane.material = planeMat
  plane.convertToFlatShadedMesh()
  plane.parent = parent

  const frame = BABYLON.Mesh.CreateGround(
    'frame',
    width,
    height,
    segments,
    scene,
    true
  )
  const frameMat = new BABYLON.StandardMaterial('frameMat', scene)
  frameMat.diffuseColor = new BABYLON.Color3(1, 1, 1)
  frameMat.wireframe = true
  frame.material = frameMat
  frame.convertToFlatShadedMesh()
  frame.parent = parent

  return { parent, plane, frame, segments }
}

// Returns a function that maps [0,1) into the target domain
const scaleTo = (min: number, max: number) => (x: number) =>
  (max - min) * x + min

// Maps from [0,1) to [0,1)
// Input resembles progress %
// Output resembles point between min and max along the output axis
const waveMod = (p: number) => -Math.cos(p * 2 * Math.PI)

function animateSpaceyDonut(
  spaceyDonut: ReturnType<typeof makeSpaceyDonutMesh>,
  min: number = 0,
  max: number = 10,
  totalFrames: number = 60
) {
  const posBuf = spaceyDonut.plane.getVerticesData(
    BABYLON.VertexBuffer.PositionKind
  )

  const scale = scaleTo(min, max)
  // p corresponds to progress of one full cycle
  // i corresponds to a phasis shift progress
  const mod = (p: number, i: number) => scale(waveMod(p + i * 2 * Math.PI))

  let counter = 0
  spaceyDonut.plane.registerBeforeRender(() => {
    const progress = counter / totalFrames
    const posNew = posBuf.map(
      (_: number, phaseIndex: number) =>
        mod(progress, phaseIndex / spaceyDonut.segments) // ! phaseProgress to unit int
    )
    spaceyDonut.plane.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      posNew,
      false,
      true
    )
    spaceyDonut.frame.updateVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      posNew,
      false,
      true
    )
    counter = (counter + 1) % totalFrames
  })
}

export function init(scene: BABYLON.Scene) {
  const spaceyDonut = makeSpaceyDonutMesh(scene)
  animateSpaceyDonut(spaceyDonut)
}
