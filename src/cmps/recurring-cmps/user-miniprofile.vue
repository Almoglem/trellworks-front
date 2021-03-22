<template>
	<div class="member-miniprofile">
        <h3 class="details-title">Board Member</h3>
		<i class="fas fa-times details-close clickable" @click="closeProfile"></i>
		<section class="flex">
			<avatar :size="40" :username="currMember.fullname"></avatar>
			<h5>{{ currMember.fullname }}</h5>
		</section>
	</div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
	props: {
		currMember: {
			type: Object
		}
	},
	data() {
		return {}
	},
	methods: {
		closeProfile() {
			this.$emit('closeProfile')
		}
	},
	components: { Avatar }
}
</script>