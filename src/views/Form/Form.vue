<template>
	<div>
		myForm
		<br />
		<!-- <div class="code"> -->
		<IndentifyCode :identifyCode="identifyCode"></IndentifyCode>
		<!-- </div> -->
		<br />
		<a-button @click="getData">点击获取数据</a-button>
		<a-upload
			name="file"
			:multiple="true"
			accept="image/*"
			action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
			:headers="headers"
			@change="handleChange"
		>
			<a-button> <a-icon type="upload" /> Click to Upload </a-button>
		</a-upload>
		<div style="height: 2000px; width: 100%">
			<a-table :columns="columns" :data-source="listData" :rowKey="record => record.id">
				<a slot="name" slot-scope="text">{{ text }}</a>
				<span slot="customTitle"><a-icon type="smile-o" /> Name</span>
			</a-table>

			<a-table :columns="columnsOne" :data-source="dataOne">
				<a slot="name" slot-scope="text">{{ text }}</a>
				<span slot="customTitle"><a-icon type="smile-o" /> Name</span>
				<span slot="tags" slot-scope="tags">
					<a-tag v-for="tag in tags" :key="tag" :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
						{{ tag.toUpperCase() }}
					</a-tag>
				</span>
				<span slot="action" slot-scope="text, record">
					<a>Invite 一 {{ record.name }}</a>
					<a-divider type="vertical" />
					<a>Delete</a>
					<a-divider type="vertical" />
					<a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
				</span>
			</a-table>
		</div>
	</div>
</template>

<script>
	const columnsOne = [
		{
			dataIndex: "name",
			key: "name",
			slots: { title: "customTitle" },
			scopedSlots: { customRender: "name" },
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
		{
			title: "Tags",
			key: "tags",
			dataIndex: "tags",
			scopedSlots: { customRender: "tags" },
		},
		{
			title: "Action",
			key: "action",
			scopedSlots: { customRender: "action" },
		},
	];

	const dataOne = [
		{
			key: "1",
			name: "John Brown",
			age: 32,
			address: "New York No. 1 Lake Park",
			tags: ["nice", "developer"],
		},
		{
			key: "2",
			name: "Jim Green",
			age: 42,
			address: "London No. 1 Lake Park",
			tags: ["loser"],
		},
		{
			key: "3",
			name: "Joe Black",
			age: 32,
			address: "Sidney No. 1 Lake Park",
			tags: ["cool", "teacher"],
		},
	];
	import IndentifyCode from "../../components/common/IdentifyCode.vue";
	export default {
		name: "Form",
		components: {
			IndentifyCode,
		},
		data() {
			return {
				identifyCode: "",
				headers: {
					authorization: "authorization-text",
				},
				dataOne,
				columnsOne,
				columns: [
					{
						dataIndex: "id",
						key: "id",
						slots: { title: "customTitle" },
						scopedSlots: { customRender: "id" },
					},
					{
						title: "image",
						dataIndex: "image",
						key: "image",
					},
					{
						title: "link",
						dataIndex: "link",
						key: "link",
					},
				],
				listData: null,
			};
		},
		created() {
			// this.getData();
			this.identifyCode = this.getCode();
		},
		mounted() {},
		computed: {},
		methods: {
			getCode() {
				var str = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789"; //(这里的字符可以随便写)
				var str2 = "";
				//(利用for循环来随机获得字符)
				for (var i = 0; i < 4; i++) {
					var n = Math.round(Math.random() * 61); //(61代表的是字符串的长度)

					// 接下来我们做字符串的拼接，在拼接之前，先判断是否由字符串有相同的字符，如果有，则不拼接。
					if (str2.indexOf(str[n]) === -1) {
						str2 = str2 + str[n];
						// 如果得到的字符在str2中存在，则需要让循环再执行一次。
					} else {
						i--;
					}
				}
				return str2;
			},
			handleChange(info) {
				if (info.file.status !== "uploading") {
					console.log(info.file, info.fileList);
				}
				if (info.file.status === "done") {
					this.$message.success(`${info.file.name} file uploaded successfully`);
				} else if (info.file.status === "error") {
					this.$message.error(`${info.file.name} file upload failed.`);
				}
			},
			async getData() {
				let res = await this.$axios.get("https://song.api.only0129.top/songwx/slides");

				this.listData = res.data;
				console.log("res", res);
				console.log(this.listData);
			},
		},
	};
</script>

<style scoped lang="less">
	* {
		color: @c1;
	}
	// .code {
	// 	width: 100px;
	// 	height: 30px;
	// }
</style>
