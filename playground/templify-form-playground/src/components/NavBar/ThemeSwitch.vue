<script setup lang="ts">
import { useAppStore } from "@/store/app"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants/icons"
import ControllerContainer from "./ControllerContainer.vue"
import { useLanguage } from "@/hooks/useLanguage"
import { useThemeStore } from "@/store"
import { storeToRefs } from "pinia"
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus"

interface IProps {
  svgClass?: string
}
defineProps<IProps>()

const { settings } = useAppStore()
const { t } = useLanguage()
const { themes, currentTheme } = storeToRefs(useThemeStore())
const { setTheme } = useThemeStore()
</script>

<template>
  <el-dropdown v-if="settings.showThemeSwitch" trigger="click" @command="setTheme">
    <ControllerContainer>
      <SvgIcon :name="EIcons.Theme" :class="svgClass" class="text-text"></SvgIcon>
    </ControllerContainer>
    <template #dropdown>
      <el-dropdown-menu popper-class="tagViewController">
        <el-dropdown-item v-for="item of themes" :key="item.value" :command="item.value">
          <label
            class="w-full py-2 px-6 text-sm flex justify-center items-center transition-colors duration-150 border-b-1 border-b-border"
            :class="currentTheme === item.value ? 'bg-primary/80 text-invert font-medium hover:bg-primary/100' : 'text-text hover:bg-muted/10'"
          >
            {{ item.labelKey ? t(item.labelKey) : item.label }}
          </label>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="less" scoped></style>
