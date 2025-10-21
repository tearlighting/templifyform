<script setup lang="ts">
import { useLanguage } from "@/hooks/useLanguage"
import { useAppStore } from "@/store/app"
import { useRouteStore } from "@/store/route"
import { storeToRefs } from "pinia"

interface IProps {
  class?: string
}
defineProps<IProps>()

const { settings } = useAppStore()
const { currentRoute } = storeToRefs(useRouteStore())
const { getMenuTitle } = useLanguage()
</script>

<template>
  <nav v-if="settings.showTitle" :class="class" role="menu-title">{{ getMenuTitle({ meta: currentRoute.meta! }) }}</nav>
</template>

<style lang="less" scoped></style>
