<script setup lang="ts">
import { ElMenuItem, ElIcon } from "element-plus"
import { EIcons } from "@/constants"





</script>

<template>
	<el-menu-item data-hiddenTooltip class="h-20! text-[16px]!">
		<el-icon>
			<SvgIcon :name="EIcons.Code" />
		</el-icon>
		<template #title>
			Templify Form
		</template>
	</el-menu-item>
</template>
