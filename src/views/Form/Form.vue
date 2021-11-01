<!--
 * @Descripttion: 
 * @version: 
 * @Author: Joshua
 * @Date: 2021-08-18 17:52:44
 * @LastEditors: 
 * @LastEditTime: 2021-11-01 17:24:14
-->
<template>
	<div>
		myForm
		<a-button @click="getData">点击获取数据</a-button>
		<div style="height: 2000px; width: 300px"></div>
	</div>
</template>

<script>
export default {
	name: 'Form',
	data() {
		return {};
	},
	created() {},
	mounted() {},
	computed: {},
	methods: {
		getData() {
			this.$axios.get('http://localhost:8008/api1/students');
		},
	},
};
</script>

<style scoped lang="less">
* {
	color: @c1;
}
</style>
