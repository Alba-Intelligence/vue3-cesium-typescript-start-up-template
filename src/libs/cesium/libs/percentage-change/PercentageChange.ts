import * as Cesium from 'cesium'

class PercentageChange {
  private viewer: Cesium.Viewer

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer
  }

  set(percentageChanged: number = 0.5): void {
    if (percentageChanged > 1 || percentageChanged < 0) {
      percentageChanged = 0.1
    }
    this.viewer.camera.percentageChanged = percentageChanged
  }

  get(): number {
    return this.viewer.camera.percentageChanged
  }
}

export default PercentageChange
