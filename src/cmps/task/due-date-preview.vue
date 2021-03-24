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
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

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
			const task = JSON.parse(JSON.stringify(this.taskToEdit))
			this.isDone = !this.isDone
			task.isCompleted = !task.isCompleted
			this.$emit('dueDateUpdated', task)
			if (this.isDone) {this.$emit('logActivity', `marked the task "${task.title}" as completed`)
					Swal.fire({
			position: 'bottom-end',
			title: 'Task completed!',
			showConfirmButton: false,
			timer: 1500,

			toast:true,
			animation:true
		})}
		}
	}, created() {
		this.deteremineDate()
		this.isDone = this.task.isCompleted
	}
})
</script>
