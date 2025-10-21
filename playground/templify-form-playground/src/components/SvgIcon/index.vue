<script setup lang="ts">
import { Icon } from "@iconify/vue"
const props = defineProps<{
  name: string
  class?: string
}>()
interface ISvgEmits {
  click: [e: MouseEvent]
}
const emit = defineEmits<ISvgEmits>()
</script>

<template>
  <Icon :icon="props.name" :class="class" @click="emit('click', $event)" />
</template>
