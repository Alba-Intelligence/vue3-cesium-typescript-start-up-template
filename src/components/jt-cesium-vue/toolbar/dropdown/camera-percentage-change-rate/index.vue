<template>
  <div class="w-40">
    <div class="name">采样率(越小越精确)</div>
    <el-slider
      v-model="value"
      :min="0"
      :max="0.5"
      :step="0.001"
      :show-tooltip="false"
      :format-tooltip="
        (val) => {
          return ((0.5 - val) * 200).toFixed(0) + '%'
        }
      "
      @change="afterChange"
    ></el-slider>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, inject } from 'vue'
import { CesiumRef, CESIUM_REF_KEY } from '@/libs/cesium/cesium-vue'

import { ElSlider } from 'element-plus'

export default defineComponent({
  name: 'camera-percentage-change-rate',
  components: { ElSlider },
  setup() {
    const value = ref<number>(0)

    const cesiumRef = inject<CesiumRef>(CESIUM_REF_KEY)

    const afterChange = (val: number) => {
      cesiumRef?.viewer?.jt?.percentageChange.set(val)
    }

    onMounted(() => {
      value.value = cesiumRef?.viewer?.jt?.percentageChange.get() || 0
    })

    return {
      value,
      afterChange,
    }
  },
})
</script>

<style scoped lang="scss"></style>
