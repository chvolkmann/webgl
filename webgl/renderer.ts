import * as THREE from 'three'

export let canvas: any = null
export let renderer: THREE.WebGLRenderer

export function init(node: Element) {
  canvas = node
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
  renderer.shadowMap.enabled = true

  canvas.children.forEach((child: any) => child.remove())
  canvas.appendChild(renderer.domElement)

  return renderer
}

export function onWindowResize() {
  if (canvas) renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
}
