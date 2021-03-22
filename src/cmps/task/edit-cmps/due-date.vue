<template class="time-picker">
	<section class="block">
		<form @submit.prevent="setDate">
		<input type="datetime-local" v-model="value"  />
		<button class="btn-success">Save</button>
		</form>
		<button @click="clearDueDate" class="btn-gray">Save</button>
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
		};
	},
	computed: {
		defaultValue() {
			if (this.dueDate) return this.dueDate;
			return new Date();
		}
	},
	methods: {
		setDate() {
			this.taskToEdit.dueDate=Date.parse(this.value)
			this.$emit('updateTask', this.taskToEdit)
			if(this.taskToEdit.dueDate)this.$emit('logActivity',`added a due date for "${this.taskToEdit.title}"`)
		},
		clearDueDate(){
			this.value=''
			this.setDate()

		}
	},
	created() {

	}
};
</script>