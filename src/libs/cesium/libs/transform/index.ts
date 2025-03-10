import * as Cesium from 'cesium'

const transform = function (
  longitude: number,
  latitude: number,
  height: number,
  rotateX: number = 0,
  rotateY: number = 0,
  rotateZ: number = 0,
  scale: number = 0
): Cesium.Matrix4 {
  // positon
  const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
  const matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(position)

  // rotate
  const matrix3X = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotateX))
  const matrix3Y = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotateY))
  const matrix3Z = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotateZ))
  Cesium.Matrix4.multiply(matrix4, matrix3X, matrix4)
  Cesium.Matrix4.multiply(matrix4, matrix3Y, matrix4)
  Cesium.Matrix4.multiply(matrix4, matrix3Z, matrix4)

  // scale
  const matrix4Scale = Cesium.Matrix4.fromUniformScale(scale)
  Cesium.Matrix4.multiply(matrix4, matrix4Scale, matrix4)

  return matrix4
}

const calculate3DTilesetTransform = function (
  tileset: Cesium.Cesium3DTileset,
  toLongitude: number | undefined = undefined,
  toLatitude: number | undefined = undefined,
  toHeight: number | undefined = undefined,
  rotateX: number = 0,
  rotateY: number = 0,
  rotateZ: number = 0,
  scale: number = 0
): void {
  tileset.readyPromise.then((self) => {
    console.log('ready', self.root.transform)

    // original coordinate
    const cartographic = Cesium.Cartographic.fromCartesian(
      self.boundingSphere.center
    )
    const longitude =
      toLongitude || Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = toLatitude || Cesium.Math.toDegrees(cartographic.latitude)
    const height = toHeight || cartographic.height

    // if move needs: change longitude/latitude/height to new position
    const matrix = transform(
      longitude,
      latitude,
      height,
      rotateX,
      rotateY,
      rotateZ,
      scale
    )

    self.root.transform = matrix

    // you can change root 'tileset.json' file: transform value, to define transform in 3d tile file.
    console.log('changed', self.root.transform)
  })
}

const change3DTilesetHeight = function (
  tileset: Cesium.Cesium3DTileset,
  heightOffset: number
): void {
  tileset.readyPromise.then((self) => {
    const cartographic = Cesium.Cartographic.fromCartesian(
      self.boundingSphere.center
    )
    const surface = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      0.0
    )
    const offset = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      heightOffset
    )
    const translation = Cesium.Cartesian3.subtract(
      offset,
      surface,
      new Cesium.Cartesian3()
    )
    self.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
  })
}

export { transform, calculate3DTilesetTransform, change3DTilesetHeight }
