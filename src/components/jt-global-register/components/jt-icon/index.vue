<template>
  <svg
    class="jt-icon block overflow-hidden fill-current stroke-current"
    :class="className"
    aria-hidden="true"
  >
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script lang="ts">
import importAll from '@/utils/import/import-all'
importAll(require.context('./svgs', true, /\.svg$/))
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'jt-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped lang="scss">
.jt-icon {
  width: 1em;
  height: 1em;
}
</style>
