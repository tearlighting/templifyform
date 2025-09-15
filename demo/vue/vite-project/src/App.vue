<script setup lang="ts">

import { useForm } from "./demoNew"
import TemplifyForm from "./components/TemplifyForm.vue"
import { ElButton } from "element-plus";
import { useLanguage } from "./hooks/useLanguage";
import { ElNotification } from "element-plus";
const { formData, formTemplate, isValid, enableAutoValidate, setError, reset, errors } = useForm()
//监听formData
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
const { setLocale } = useLanguage()

</script>

<template>
	<div class="demo-container">
		<templify-form :template="<any>formTemplate" :form-data="formData"></templify-form>
		<div class="buttonsWrapper">
			<label>isValid:</label>
			<el-button size="large" type="primary" :disabled="!isValid" @click="submit">submit</el-button>
			<el-button size="large" type="primary" @click="clear">reset</el-button>
		</div>
		<div class="buttonsWrapper">
			<label>setError:</label>
			<el-button size="large" type="primary" @click="() => setError('code', 'manual error')">setError</el-button>
			<el-button size="large" type="primary" :disabled="isValid" @click="showErrors">errors</el-button>
		</div>
		<div>
			<label>Language: </label>
			<el-button size="large" type="primary" @click="() => setLocale('zh')">中文</el-button>
			<el-button size="large" type="primary" @click="() => setLocale('jp')">日本語</el-button>
			<el-button size="large" type="primary" @click="() => setLocale('en')">English</el-button>
		</div>
	</div>
</template>

<style scoped>
.demo-container {
	width: 500px;
	background-color: #e5e7eb;
	padding: 2em 3em;
	border-radius: 2em;
}

.buttonsWrapper {
	margin-bottom: 1em;

	&>label {
		display: inline-block;
		width: 5em;
	}
}
</style>
