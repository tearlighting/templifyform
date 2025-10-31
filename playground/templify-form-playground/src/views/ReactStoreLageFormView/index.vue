<script lang="ts" setup>
import { renderRect } from "@/utils/react"
import { onMounted, ref } from "vue"
import { App } from "./APP"
defineOptions({
  name: "ReactStoreLargeForm",
})
const appRef = ref<HTMLDivElement>()

onMounted(() => {
  console.log("Onmount")

  return renderRect({
    el: appRef.value!,
    App,
  })
})
console.log(123)
</script>

<template>
  <div class="size-full flex justify-center items-center overflow-hidden">
    <div class="w-full max-h-full overflow-y-auto xl:px-10 md:2" ref="appRef"></div>
  </div>
</template>
