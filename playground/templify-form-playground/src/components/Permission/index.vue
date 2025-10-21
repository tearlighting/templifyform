<script setup lang="ts">
import type { EPemission } from "@/constants"
import { useUserStore } from "@/store/user"
const props = defineProps<{
  permission: EPemission[]
}>()
const { hasPemission } = useUserStore()
</script>

<template>
  <slot v-if="hasPemission(props.permission)"></slot>
</template>

<style lang="less" scoped></style>
