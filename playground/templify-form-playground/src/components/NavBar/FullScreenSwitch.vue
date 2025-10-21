<script setup lang="ts">
import { useAppStore } from "@/store/app"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants/icons"
import ControllerContainer from "./ControllerContainer.vue"
import { useFullScreen } from "@/hooks/useFullScreel"

interface IProps {
  svgClass?: string
}

defineProps<IProps>()
const { settings } = useAppStore()
const { fullScreen } = useFullScreen()
</script>

<template>
  <ControllerContainer v-if="settings.showFullScreenSwitch">
    <SvgIcon :name="EIcons.Fullscreen" class="text-text" :class="svgClass" @click="fullScreen"></SvgIcon>
  </ControllerContainer>
</template>

<style lang="less" scoped></style>
