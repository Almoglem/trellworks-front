<template>
	<section>
		<!-- <div
      :class="{ 'pop-up-window': userWindow }"
      @mousedown.self="closeEdit"
    ></div> -->
		<section v-if="showModal"  class="quick-edit-modal">
			<section class="quick-edit">
				<p @click.stop="closeEdit">X</p>
				<input type="text" />
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
	data() {
		return {
			showModal: true
		}
	},
	methods: {
		closeEdit() {
			this.$emit('toggleEdit', false)
		}
	}
}
</script>
