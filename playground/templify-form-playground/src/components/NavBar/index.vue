<script setup lang="ts">
import MenuSwitch from "./MenuSwitch.vue"
import MenuTitle from "./MenuTitle.vue"
import FullScreenSwitch from "./FullScreenSwitch.vue"
import LocaleSwitch from "./LocaleSwitch.vue"
import ThemeSwitch from "./ThemeSwitch.vue"
import UserAvatar from "./UserAvatar.vue"
import { useAppStore } from "@/store/app"
const {
	settings: { },
} = useAppStore()
</script>

<template>
	<div class="flex items-center justify-between w-full relative border-b-1 border-b-border" role="nav-bar">
		<MenuSwitch />
		<MenuTitle class="absolute left-1/2 -translate-x-1/2" />
		<div class="flex items-center md:gap-2">
			<LocaleSwitch />
			<ThemeSwitch />
			<FullScreenSwitch />
			<user-avatar />
		</div>
	</div>
</template>

<style lang="less" scoped></style>
