<script setup lang="ts">
interface ISlots {
  left: any
  centerLine1: any
  centerLine2: any
  centerLine3: any
  right: any
  default: any
}

defineSlots<ISlots>()

defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="flex h-screen" :class="class" role="presentation" data-section="layout-root">
    <!-- 左侧栏 -->
    <aside class="w-fit flex-shrink-0" role="complementary" data-section="left">
      <slot name="left" />
    </aside>

    <!-- 中间部分 -->
    <main class="flex-1 flex flex-col" role="main" data-section="center">
      <!-- 三行可插槽 -->
      <header class="h-fit flex items-center" data-section="center-line1">
        <slot name="centerLine1" />
      </header>
      <div class="h-fit flex items-center" data-section="center-line2">
        <slot name="centerLine2" />
      </div>
      <div class="h-fit flex items-center" data-section="center-line3">
        <slot name="centerLine3" />
      </div>
      <!-- 主体内容 -->
      <section class="flex-1 overflow-auto" data-section="center-main">
        <slot />
      </section>
    </main>

    <!-- 右侧栏 -->
    <aside class="w-fit flex-shrink-0 border-l" role="complementary" data-section="right">
      <slot name="right" />
    </aside>
  </div>
</template>
