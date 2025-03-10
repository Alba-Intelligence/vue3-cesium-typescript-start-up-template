<template>
  <overlay :positionMode="'fixed'" :top="toolbarHeight" v-if="visible">
    <jtDraggableResizable
      v-model="visible"
      :resizable="false"
      :w="400"
      :h="120"
      :initialPosition="'tr'"
      class="pointer-events-auto"
    >
      <template v-slot:title>{{ `影像配置-${imageryLayerName}` }}</template>
      <div class="w-full bg-gray-800 bg-opacity-70">
        <div class="w-full flex flex-col px-8 rounded-lg" @click.stop>
          <div class="my-0">
            <div class="text-gray-50">alpha：</div>
            <el-slider
              v-model="alpha"
              :min="0"
              :max="1"
              :step="0.05"
              @change="(val) => afterChange('alpha', val)"
            />
          </div>
          <div class="my-0">
            <div class="text-gray-50">亮度：</div>
            <el-slider
              v-model="brightness"
              :min="0"
              :max="6"
              :step="0.05"
              @change="(val) => afterChange('brightness', val)"
            />
          </div>
          <div class="my-0">
            <div class="text-gray-50">对比度：</div>
            <el-slider
              v-model="contrast"
              :min="0"
              :max="6"
              :step="0.05"
              @change="(val) => afterChange('contrast', val)"
            />
          </div>
          <div class="my-0">
            <div class="text-gray-50">色调：</div>
            <el-slider
              v-model="hue"
              :min="0"
              :max="12"
              :step="0.05"
              @change="(val) => afterChange('hue', val)"
            />
          </div>
          <div class="my-0">
            <div class="text-gray-50">饱和度：</div>
            <el-slider
              v-model="saturation"
              :min="0"
              :max="12"
              :step="0.05"
              @change="(val) => afterChange('saturation', val)"
            />
          </div>
        </div>
      </div>
    </jtDraggableResizable>
  </overlay>
</template>

<script lang="ts">
const CHANGE_EVENT = 'change'
const UPDATE_MODEL_EVENT = 'update:modelValue'

import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
  watchEffect,
} from 'vue'
import { ElSlider } from 'element-plus'
import overlay from '@/components/jt-overlay/index.vue'
import store from '@/store'
import jtDraggableResizable from '@/components/jt-draggable-resizable/index.vue'

export default defineComponent({
  name: '',
  components: { ElSlider, overlay, jtDraggableResizable },
  props: {
    a: Number,
    b: Number,
    c: Number,
    h: Number,
    s: Number,
    cb: Function,
    imageryLayerName: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {
    const alpha = ref(props.a)
    const brightness = ref(props.b)
    const contrast = ref(props.c)
    const hue = ref(props.h)
    const saturation = ref(props.s)
    const visible = ref(props.modelValue)

    const afterChange = (key: string, val: number): void => {
      context.emit(CHANGE_EVENT, key, val)
    }

    const toolbarHeight = computed((): string => {
      const h = store.state.jtCesiumVue.layout.toolbarHeight
      return `${h}px`
    })

    watch(
      () => props.modelValue,
      (val) => {
        visible.value = val
      }
    )

    watch(visible, (val) => {
      context.emit(UPDATE_MODEL_EVENT, val)
    })

    watchEffect(() => {
      alpha.value = props.a
      brightness.value = props.b
      contrast.value = props.c
      hue.value = props.h
      saturation.value = props.s
    })

    onMounted(() => {
      alpha.value = props.a || 0
      brightness.value = props.b || 0
      contrast.value = props.c || 0
      hue.value = props.h || 0
      saturation.value = props.s || 0
    })

    return {
      alpha,
      brightness,
      contrast,
      hue,
      saturation,
      visible,
      afterChange,
      toolbarHeight,
    }
  },
  emits: {
    [CHANGE_EVENT](key: string, val: number) {
      return true
    },

    [UPDATE_MODEL_EVENT](val: boolean) {
      return true
    },
  },
})
</script>
