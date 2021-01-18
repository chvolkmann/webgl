import BABYLON from 'babylonjs'
import _ from 'lodash'

export type Modulator = (
  progress: number,
  deltaSecs: number,
  elapsedSecs: number
) => number

export default class Modulation {
  public target: any
  public prop: string
  public duration: number
  public modulator: Modulator
  public min: number
  public max: number

  protected initTime?: number = null
  protected prevTime?: number = null

  constructor(
    target: any,
    prop: string,
    duration: number,
    min: number,
    max: number,
    modulator: Modulator
  ) {
    this.target = target
    this.prop = prop
    this.duration = duration
    this.min = min
    this.max = max
    this.modulator = modulator
  }

  updateValue(x: number) {
    // console.log(x)
    _.set(this.target, this.prop, x)
  }

  modulate() {
    // Invokes this.modulator with a progress value in [0, 1)

    const now = Date.now()
    if (!this.initTime) this.initTime = now
    if (!this.prevTime) this.prevTime = this.initTime
    const elapsed = (now - this.initTime) / 1000
    const delta = (now - this.prevTime) / 1000
    const progress = (elapsed % this.duration) / this.duration
    let val = this.modulator(progress, delta, elapsed)
    val = val * this.max + this.min
    this.updateValue(val)
  }
}
