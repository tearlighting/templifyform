<script setup lang="ts">
import clsx from "clsx"
import { computed } from "vue"

interface IProps {
	title?: string
	size?: "sm" | "md" | "lg"
	class?: string
}
const props = defineProps<IProps>()

const sizes = {
	sm: "w-7 h-7",
	md: " sm:w-9 sm:h-9 w-7 h-7",
	lg: "w-11 h-11",
}

const sizeClass = computed(() => sizes[props.size ?? "md"])
</script>

<template>
	<button type="button"
		class="flex items-center justify-center rounded-md transition-colors bg-transparent hover:bg-surface hover:text-primary active:bg-primary active:text-invert border-0 outline-none hover: cursor-pointer"
		:class="clsx(sizeClass, props.class)" :title="props.title" role="controller-container">
		<slot></slot>
	</button>
</template>
