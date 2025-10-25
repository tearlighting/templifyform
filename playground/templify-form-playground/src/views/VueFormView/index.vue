<script lang="ts" setup>
import { useLanguage } from "@/hooks/useLanguage"
import { useForm } from "./hooks"
import { ElNotification } from "element-plus"
import TemplifyForm from "@/components/TemplifyForm/TemplifyForm.vue"
import { ElButton, ElFormItem, ElInput } from "element-plus";

const { formStore: {
	formData, formTemplate, isValid, errors
}, enableAutoValidate, setError, reset, } = useForm()



enableAutoValidate()

function submit() {
	ElNotification.success({
		title: 'Success',
		message: JSON.stringify(formData),
		duration: 2000
	})
}

function clear() {
	reset({})
}

function showErrors() {
	ElNotification.error({
		title: 'Error',
		message: JSON.stringify(errors.value),
		duration: 2000
	})
}
const { setLocale, t } = useLanguage()


</script>

<template>
	<div class="size-full flex justify-center items-center text-text">
		<div class="w-full min-w-100 max-w-150 md:px-2 md:py-3">
			<templify-form :template="<any>formTemplate" :form-data="formData">
				<template #password="{ item }">
					<ElFormItem :prop="item.prop" :error="item.error.resolve({ t })" :class="item.formItemClassName">
						<template v-slot:label>
							<span :class="item.formItemLabelClassName">{{ item.label.resolve({ t }) }}</span>
						</template>
						<ElInput size="large" v-model="formData[item.prop as keyof typeof formData]"
							:class="item.formItemContentClassName" show-password>
						</ElInput>
					</ElFormItem>
				</template>
			</templify-form>
			<div class="mb-5">
				<label class="inline-block w-30 text-right pr-5 mr-3">isValid</label>
				<el-button size="large" type="primary" :disabled="!isValid" @click="submit">submit</el-button>
				<el-button size="large" type="primary" @click="clear">clear</el-button>
				<el-button size="large" type="primary" @click="() => reset()">reset</el-button>
			</div>
			<div class="mb-5">
				<label class="inline-block w-30 text-right pr-5 mr-3">setError</label>
				<el-button size="large" type="primary"
					@click="() => setError('code', 'defaultForm.customError')">setError</el-button>
				<el-button size="large" type="primary" :disabled="isValid" @click="showErrors">errors</el-button>
			</div>
			<div>
				<label class="inline-block w-30 text-right pr-5 mr-3">Language </label>
				<el-button size="large" type="primary" @click="() => setLocale('zh')">中文</el-button>
				<el-button size="large" type="primary" @click="() => setLocale('jp')">日本語</el-button>
				<el-button size="large" type="primary" @click="() => setLocale('en')">English</el-button>
			</div>

		</div>
	</div>
</template>