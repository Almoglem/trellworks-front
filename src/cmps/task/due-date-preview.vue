<template>
	<section>
		<button
			@mouseover="showClock = false"
			@mouseleave="showClock = true"
			class="due"
			:class="[dueClass, { success: isDone }]"
			@click.stop="toggleComlpetion"
		>
			<span :class="{success:isDone}" v-if="!showClock"> </span>
			<i v-else class="far fa-clock"></i>
			{{ previewDate(task.dueDate) }}
		</button>
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
			dueClass: '',
			taskToEdit: JSON.parse(JSON.stringify(this.task)),
			isDone: false,
			showClock: true
		}
	},
	methods: {
		moment: function () {
			return moment();
		},
		previewDate(date) {
			return moment(date).format('DD MMM')
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
			this.$emit('dueDateUpdated', this.taskToEdit)
			if (this.taskToEdit.isCompleted) this.$emit('logActivity', `marked the task "${this.task.title}" as completed`)
		}
	}, created() {
		this.deteremineDate()
		this.isDone = this.task.isCompleted
	}
})
</script>
