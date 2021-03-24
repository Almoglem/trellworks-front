<template class="time-picker">
	<section class="block">
		<form @submit.prevent="setDate">
		<input type="datetime-local" v-model="value"  />
		<button class="btn-success">Save</button>
		<button @click.prevent="clearDueDate" style="float:right" class="btn-gray">Unset</button>
		</form>
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
			if(this.taskToEdit.dueDate)this.$emit('logActivity',`added a due date for "${this.taskToEdit.title}"`)
			this.$emit('updateTask', this.taskToEdit)
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