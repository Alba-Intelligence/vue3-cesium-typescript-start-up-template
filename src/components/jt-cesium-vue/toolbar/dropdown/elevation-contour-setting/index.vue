<template>
  <div class="elevation-contour-setting" @click.stop>
    <div class="flex flex-row w-full justify-center items-center">
      <div class="flex-0 w-16">等高距</div>
      <div class="flex-0 w-40 ml-3">
        <el-slider
          :disabled="!elevationContourActive"
          v-model="contourDistance"
          :min="contourMinDistance"
          :max="contourMaxDistance"
          :step="10"
          :format-tooltip="
            (val) => {
              return val.toFixed(0) + '米'
            }
          "
          @change="contourDistanceChange"
          class="w-full"
        />
      </div>
      <div class="flex-0 ml-3">
        <el-input-number
          :disabled="!elevationContourActive"
          v-model="contourDistance"
          :min="contourMinDistance"
          :max="contourMaxDistance"
          size="small"
          @change="contourDistanceChange"
        />
      </div>
    </div>

    <div class="flex flex-row w-full justify-center items-center">
      <div class="flex-0 w-16">线宽</div>
      <div class="flex-0 w-40 ml-3">
        <el-slider
          :disabled="!elevationContourActive"
          v-model="contourWidth"
          :min="contourMinWidth"
          :max="contourMaxWidth"
          :step="1"
          @change="contourWidthChange"
          class="w-full"
        />
      </div>
      <div class="flex-0 ml-3">
        <el-input-number
          :disabled="!elevationContourActive"
          v-model="contourWidth"
          :min="contourMinWidth"
          :max="contourMaxWidth"
          size="small"
          @change="contourWidthChange"
        />
      </div>
    </div>

    <div class="flex flex-row w-full justify-center items-center">
      <div class="flex-0 w-12">颜色</div>
      <div class="flex-1">
        <el-color-picker
          :disabled="!elevationContourActive"
          v-model="contourColor"
          @change="contourColorChange"
          color-format="rgb"
          show-alpha
        ></el-color-picker>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject } from 'vue'
import { CesiumRef, CESIUM_REF_KEY } from '@/libs/cesium/cesium-vue'
import { ElSlider, ElInputNumber, ElColorPicker } from 'element-plus'
import store from '@/store'
import { rgbaStringToStruct } from '@/libs/utils/rgb'

export default defineComponent({
  name: '',
  components: { ElSlider, ElInputNumber, ElColorPicker },
  setup() {
    const contourDistance = ref(100)
    const contourMinDistance = ref(30)
    const contourMaxDistance = ref(1000)

    const contourWidth = ref(1)
    const contourMinWidth = ref(1)
    const contourMaxWidth = ref(10)

    const contourColor = ref('rgba(255, 0, 0, 1)')

    const elevationContourActive = computed((): boolean => {
      return store.state.jtCesiumVue.toolbar.elevationContourActive
    })

    const cesiumRef = inject<CesiumRef>(CESIUM_REF_KEY)

    const contourDistanceChange = (val: number): void => {
      const { viewer } = cesiumRef || {}
      if (!viewer) {
        return
      }
      if (
        !viewer.scene.globe.material ||
        viewer.scene.globe.material.type !== 'ElevationContour'
      ) {
        return
      }
      const uniforms = viewer.scene.globe.material.uniforms
      uniforms.spacing = contourDistance.value
    }

    const contourWidthChange = (val: number): void => {
      const { viewer } = cesiumRef || {}
      if (!viewer) {
        return
      }
      if (
        !viewer.scene.globe.material ||
        viewer.scene.globe.material.type !== 'ElevationContour'
      ) {
        return
      }
      const uniforms = viewer.scene.globe.material.uniforms
      uniforms.width = contourWidth.value
    }

    const contourColorChange = (val: string): void => {
      const { viewer } = cesiumRef || {}
      if (!val || !viewer) {
        return
      }
      if (
        !viewer.scene.globe.material ||
        viewer.scene.globe.material.type !== 'ElevationContour'
      ) {
        return
      }
      const { red, green, blue, alpha } = rgbaStringToStruct(val)
      const uniforms = viewer.scene.globe.material.uniforms
      uniforms.color.red = red / 255
      uniforms.color.green = green / 255
      uniforms.color.blue = blue / 255
      //   uniforms.color.alpha = rgba.a
    }

    return {
      contourDistance,
      contourMinDistance,
      contourMaxDistance,
      contourWidth,
      contourMinWidth,
      contourMaxWidth,
      contourColor,
      elevationContourActive,
      contourDistanceChange,
      contourWidthChange,
      contourColorChange,
    }
  },
})
</script>

<style scoped lang="scss">
.elevation-contour-setting {
  :deep(.el-input-number) {
    width: 110px;
  }
}
</style>
