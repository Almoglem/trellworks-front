<template class="time-picker">
	<section class="block">
		<el-form @submit.native.prevent="setDate">
			<el-date-picker
				placeholder="Select date and time"
				:picker-options="pickerOptions"
				type="date"
				v-model="value"
			/>
			<button class="btn-success">Save</button>
			<button
				@click.prevent="clearDueDate"
				style="float: right"
				class="btn-gray"
			>
				Unset
			</button>
		</el-form>
	</section>
</template>

<script>
export default {
	props: {
		dueDate: Number,
		task: Object
	},
	data() {
		return {
			taskToEdit: JSON.parse(JSON.stringify(this.task)),
				value: '',
					pickerOptions: {
				shortcuts: [{
					text: 'Today',
					onClick(picker) {
						picker.$emit('pick', new Date());
					}
				}, {
					text: 'Tomorrow',
					onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24);
						picker.$emit('pick', date);
					}
				}, {
					text: 'in a week',
					onClick(picker) {
						const date = new Date();
						date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
						picker.$emit('pick', date);

					}
				}]
			}
		}
	},
	computed: {
		defaultValue() {
			if (this.dueDate) return this.dueDate;
			return new Date();
		}
	},
	methods: {
		setDate() {
			this.taskToEdit.dueDate = Date.parse(this.value)
			if (this.taskToEdit.dueDate) this.$emit('logActivity', `added a due date for "${this.taskToEdit.title}"`)
			else this.$emit('logActivity', `removed a due date from "${this.taskToEdit.title}"`)
			this.$emit('updateTask', this.taskToEdit)
		},
		clearDueDate() {
			this.value = ''
			this.setDate()

		}
	}
}
</script>