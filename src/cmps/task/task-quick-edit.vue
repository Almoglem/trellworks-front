<template>
	<section>
		<!-- <div
      :class="{ 'pop-up-window': userWindow }"
      @mousedown.self="closeEdit"
    ></div> -->
		<section v-if="showModal"  class="quick-edit-modal">
			<section class="quick-edit">
				<p @click.stop="closeEdit">X</p>
				<form @submit.prevent="updateTask">
				<input type="text" v-model="taskToEdit.title" />
				</form>
				<div class="quick-edit-menu">
					<ul>
						<li>archive</li>
						<li>archive</li>
						<li>archive</li>
						<li>archive</li>
					</ul>
				</div>
			</section>
		</section>
	</section>
</template>

<script>
export default {
	props:{
		task: {
			type:Object
		}},
	data() {
		return {
			showModal: true,
			taskToEdit: JSON.parse(JSON.stringify(this.task))
		}
	},
	methods: {
		closeEdit() {
			this.$emit('toggleEdit', false)
		},
		updateTask(){
			const task=this.taskToEdit
			this.$emit('quickEdited',task)
		}
	}
}
</script>
