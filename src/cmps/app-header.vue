<template>
	<header class="flex">
		<nav class="flex">
			<router-link class="header-btn transition" to="/">Home</router-link>
			<router-link class="header-btn transition" to="/boards"
				>Boards</router-link
			>
		</nav>
		<router-link to="/">
			<span class="main-logo" aria-label="logo">Trellworks</span>
		</router-link>
		<section class="flex">
			<p v-if="loggedInUser"><avatar :size="30" :username="loggedInUser.fullname"></avatar></p>
			<section v-else class="nav-side-buttons header-btn transition">
				<router-link to="/login" >Login / Signup</router-link>
			</section>
		</section>
	</header>
</template>
<script>
import Avatar from "vue-avatar";

export default {
	computed: {
		loggedInUser() {
			return this.$store.getters.loggedinUser
		}
	},
    components: { Avatar },

};
</script>