<script setup lang="ts">

import { ElForm, ElInput, ElFormItem } from "element-plus"
import type { IFormTemplateItem } from "templify-form"
import { useLanguage } from "@/hooks/useLanguage";

interface ITemplifyFormProps<TProps extends string = string, TResolveCxt = any> {
	template: IFormTemplateItem<TProps, TResolveCxt, Record<TProps, any>>[]
	formData: Record<TProps, any>
}
const props = defineProps<ITemplifyFormProps>()
const { t } = useLanguage()


interface ISlots {
	[key: string]: [item: IFormTemplateItem<string, any, any>]
}
defineSlots<ISlots>()
</script>

<template>
	<div role="templify-form-demo" class="size-full">
		<ElForm>
			<template v-for="item of props.template" :key="item.prop">
				<template v-if="item.render">
					<component :is="item.render(item, formData, t)"></component>
				</template>
				<template v-else>
					<slot :name="item.prop" :item=item>
						<ElFormItem :prop="item.prop" :error="item.error.resolve({ t })"
							:class="item.formItemClassName">
							<template v-slot:label>
								<span :class="item.formItemLabelClassName">{{ item.label.resolve({ t }) }}</span>
							</template>
							<ElInput size="large" v-model="formData[item.prop]" :class="item.formItemContentClassName">
							</ElInput>
						</ElFormItem>
					</slot>
				</template>
			</template>
		</ElForm>
	</div>
</template>

<style lang="less" scoped></style>
