<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { App } from "./APP"
import { renderRect } from '@/utils/react';

const appRef = ref<HTMLDivElement>()

onMounted(() => {
	return renderRect({
		el: appRef.value!,
		App,
	})
})
</script>

<template>
	<div class="size-full flex justify-center items-center overflow-hidden	">
		<div class="w-full max-h-full overflow-y-auto xl:px-10 md:2" ref="appRef">123</div>
	</div>
</template>