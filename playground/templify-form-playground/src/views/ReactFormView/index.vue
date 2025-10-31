<script lang="ts" setup>
import { renderRect } from "@/utils/react"
import { onMounted, ref } from "vue"
import { App } from "./APP"
defineOptions({
  name: "ReactForm",
})
const appRef = ref<HTMLDivElement>()

onMounted(() => {
  return renderRect({
    el: appRef.value!,
    App,
  })
})
</script>

<template>
  <div class="size-full flex justify-center items-center">
    <div class="w-200 px-2 py-3" ref="appRef">123</div>
  </div>
</template>
