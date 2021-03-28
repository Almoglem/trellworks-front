<template>
	<section class="container home text-center">
		<app-header />
		<main class="hero-container">
			<!-- <img src="../assets/img/option2.png" class="main-img" /> -->
			<div class="hero">
				<div class="cta">
					<h1 class="text-center">Take your team to new heights.</h1>
					<router-link to="/board/605c6ee08defda42fc5e20ee" class="action-call transition"
						>Try it now!</router-link
					>
				</div>
				<lottie-player
					autoplay
					loop
					mode="normal"
			speed="0.5"
					src="https://assets5.lottiefiles.com/packages/lf20_yhrzppye.json"
					class="home-hero"
				>
				</lottie-player>
			</div>
		</main>
		<div class="second-container">
			<div class="img-container video-ratio"><img src="../assets/img/trellworks-intro.gif" alt=""></div>
			<div>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate necessitatibus adipisci dicta sequi repudiandae distinctio minima inventore consequatur, repellat doloribus ducimus ut dolores nobis explicabo sunt, nesciunt impedit quas temporibus?
			</div>
		</div>
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
