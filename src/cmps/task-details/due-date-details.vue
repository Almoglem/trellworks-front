<template>
	<section>
		<button
			v-if="isDone"
			class="uppercase-title due success"
			@click="toggleComlpetion"
		>
			completed! {{ dueTime(task.dueDate) }}
		</button>
		<button
			v-else
			class="uppercase-title due due-details"
			:class="dueClass"
			@click="toggleComlpetion"
		>
			{{ dueTime(task.dueDate) }}
		</button>
		<span> Due {{ fullDate(task.dueDate) }}</span>
	</section>
</template>

<script>
import moment from "moment";

export default ({
	props: {
		task: Object,
	},
	data() {
		return {
			taskToEdit: JSON.parse(JSON.stringify(this.task)),
			dueClass: '',
			isDone: false
		}
	},
	methods: {
		moment: function () {
			return moment();
		},
		dueTime(date) {
			return moment(date).fromNow();
		},
		fullDate(date) {
			return moment(date).format('DD-MM-YYYY HH:MM')
		},
		deteremineDate() {
			const dateStr = (moment(this.task.dueDate).fromNow());
			if (dateStr.includes('ago')) return this.dueClass = "overdue"
			else if (dateStr.includes('days')) this.dueClass = "days"
			else if (dateStr.includes('weeks') || dateStr.includes('week')) this.dueClass = "weeks"
			else if (dateStr.includes('hours') || dateStr.includes('hour') || dateStr.includes('day')) this.dueClass = "hours"
			else this.dueClass = "months"
		},
		toggleComlpetion() {
			this.isDone = !this.isDone
			this.taskToEdit.isCompleted = !this.taskToEdit.isCompleted
			this.$emit('updateTask', this.taskToEdit)
			if(this.taskToEdit.isCompleted)this.$emit('logActivity',`marked the task "${this.task.title}" as completed`)
		}
	}, created() {
		this.deteremineDate()
		this.isDone = this.task.isCompleted
	},

})
</script>
