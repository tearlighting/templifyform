<script setup lang="ts">
import { ElMenuItem, ElSubMenu, ElMenuItemGroup, ElIcon } from "element-plus"
import SvgIcon from "@/components/SvgIcon/index.vue"
import type { AppRoute } from "router"
import { useLanguage } from "@/hooks/useLanguage"
import { computed } from "vue"
const { getMenuTitle } = useLanguage()
const props = defineProps<{
  routeItem: AppRoute
}>()

const title = computed(() => getMenuTitle(props.routeItem))
</script>

<template>
  <!-- 有子菜单 -->
  <el-sub-menu v-if="routeItem.children?.length" :index="String(routeItem.name)">
    <template #title>
      <el-icon v-if="routeItem.meta?.icon"> <SvgIcon :name="routeItem.meta.icon!" /></el-icon>

      <span>{{ title }}</span>
    </template>
    <el-menu-item-group>
      <!-- 递归渲染子菜单 -->
      <MenuItem v-for="child in routeItem.children" :key="child.name" :routeItem="child" />
    </el-menu-item-group>
  </el-sub-menu>

  <!-- 没有子菜单 -->
  <el-menu-item v-else :index="String(routeItem.name)" data-hiddenTooltip>
    <el-icon v-if="routeItem.meta?.icon"> <SvgIcon :name="routeItem.meta.icon!" /></el-icon>
    <template #title>
      <span>{{ title }}</span>
    </template>
  </el-menu-item>
</template>
