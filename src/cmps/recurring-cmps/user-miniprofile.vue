<template>
	<div class="member-miniprofile">
		<h3 class="pop-up-title">Board Member</h3>
		<i class="fas fa-times details-close clickable" @click="closeProfile"></i>
		<hr>
		<section class="flex">
			<img
				v-if="currMember.profileImg"
				class="user-profileimg"
				:src="currMember.profileImg"
				alt=""
			/>
			<avatar v-else :size="30" :username="currMember.fullname"></avatar>
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