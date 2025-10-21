<script setup lang="ts">
import { useAppStore } from "@/store/app"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from "@/constants/icons"
import ControllerContainer from "./ControllerContainer.vue"
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus"

const { settings } = useAppStore()
interface IProps {
  svgClass?: string
}

defineProps<IProps>()
</script>

<template>
  <el-dropdown v-if="settings.showUserAvatar" trigger="click">
    <ControllerContainer>
      <SvgIcon :name="EIcons.User" :class="svgClass" class="text-text"></SvgIcon>
    </ControllerContainer>
    <template #dropdown>
      <el-dropdown-menu popper-class="tagViewController">
        <el-dropdown-item>
          <label class="w-full py-2 px-6 text-sm flex justify-center items-center transition-colors duration-150 border-b-1 border-b-border" :class="'text-text hover:bg-muted/10'"> logout </label>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="less" scoped></style>
