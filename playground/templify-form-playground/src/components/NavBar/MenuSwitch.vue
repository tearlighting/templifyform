<script setup lang="ts">
import { useAppStore } from "@/store/app"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants/icons"
import ControllerContainer from "./ControllerContainer.vue"
import { useMenu } from "@/hooks/useMenu"
interface IProps {
  svgClass?: string
}

defineProps<IProps>()

const { settings } = useAppStore()
const { toggleMenu } = useMenu()
</script>

<template>
  <ControllerContainer v-if="settings.showMenuSwitch" @click="toggleMenu">
    <SvgIcon :name="EIcons.MenuClose" :class="svgClass"></SvgIcon>
  </ControllerContainer>
</template>

<style lang="less" scoped></style>
