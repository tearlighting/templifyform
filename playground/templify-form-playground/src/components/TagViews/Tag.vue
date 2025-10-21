<script setup lang="ts">
interface ITagEmits {
  click: [e: MouseEvent]
}
const emit = defineEmits<ITagEmits>()

interface ITagSlots {
  header: string
  footer: string
  default: string
}
defineSlots<ITagSlots>()

interface ITagProps {
  class?: string
}
defineProps<ITagProps>()
</script>

<template>
  <div
    role="tag-container"
    @click="emit('click', $event)"
    class="flex items-center justify-center gap-1 px-2 py-1 rounded-sm border border-border bg-surface text-text/60 md:text-sm shadow-sm cursor-pointer select-none hover:bg-bg hover:shadow transition-all duration-200 ease-in-out sm:px-2 sm:py-1 sm:text-base group/tag"
    :class="class"
  >
    <div role="tag-header" class="w-fit text-sm sm:text-base font-medium text-muted">
      <slot name="header"></slot>
    </div>
    <span role="tag-content" class="truncate font-medium max-w-[8rem] sm:max-w-[12rem]">
      <slot>tag</slot>
    </span>
    <div role="tag-footer" class="w-fit text-xs sm:text-sm text-text opacity-0 group-hover/tag:opacity-100 transition-all duration-75">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
