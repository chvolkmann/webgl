let navigator: Navigator
export function init(n: Navigator & { xr: any }) {
  navigator = n
}

// async function getDisplays() {
//   const displays = await navigator.getVRDisplays()

// }

export function scan() {
  if (!navigator.getGamepads) throw new Error('Gamepad API not supported')
  // if (!navigator.xr) throw new Error('WebXR API not supported')

  console.log(navigator.getGamepads())
}
