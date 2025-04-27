<script setup lang="ts">
import { useForm, ETemplateType } from './demo'

const { formData,
	formTemplate, watch } = useForm()

function handleSubmit() {
	watch();
	if (formTemplate.every(item => !item.error)) {
		console.log('提交成功')
	} else {
		console.log('提交失败')
	}

}


</script>

<template>
	<div class="demo-container">
		<ElForm>

			<el-form-item v-for="item of formTemplate" :key="item.prop" :label="item.label" :error="item.error">
				<el-select v-if="item.type === ETemplateType.select" v-model="formData[item.prop]" placeholder="请选择">
					<el-option v-for="opt of item.option" :key="opt.value" :label="opt.label"
						:value="opt.value"></el-option>
				</el-select>
				<el-input v-else v-model="formData[item.prop]" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSubmit">submit</el-button>
			</el-form-item>
		</ElForm>
	</div>
</template>

<style scoped>
.demo-container {
	width: 500px;
	height: 100vh;
	/* background: #000; */
}
</style>
