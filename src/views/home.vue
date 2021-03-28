<template>
	<section class="container home text-center">
		<app-header />
		<main class="page-content">
			<!-- <img src="../assets/img/option2.png" class="main-img" /> -->
			<lottie-player
				autoplay
				loop
				mode="normal"
				src="https://assets5.lottiefiles.com/packages/lf20_yhrzppye.json"
				class="home-hero"
			>
			</lottie-player>
			<span class="cta">
				<h1 class="text-center">Managing your team has never been easier.</h1>
				<router-link to="/board/605c6ee08defda42fc5e20ee" class="action-call transition"
					>Try it now!</router-link
				>
			</span>
		</main>
	</section>
</template>

<script>
import appHeader from "@/cmps/app-header";
import boardHeader from "../cmps/board/board-header.vue";
export default {
	name: "home",
	data() {
		return {};
	},
	computed: {
		boards() {
			this.$store.getters.boards;
		},
	},
	created() { },
	methods: {},
	components: {
		appHeader,
		boardHeader,
	},
};
</script>
