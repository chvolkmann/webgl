import * as THREE from 'three'

export let renderer: THREE.WebGLRenderer

export function init(canvas: Element) {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize((<any>canvas).offsetWidth, (<any>canvas).offsetHeight)
  renderer.shadowMap.enabled = true

  canvas.children.forEach((child: any) => child.remove())
  canvas.appendChild(renderer.domElement)

  return renderer
}

export function setAspectRatio(width: number, height: number) {
  renderer.setSize(width, height)
}
