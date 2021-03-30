<template>
  <section class="container home text-center">
    <app-header />
    <main class="hero-container">
      <div class="hero">
        <lottie-player
          autoplay
          loop
          mode="normal"
          speed="0.5"
          src="https://assets5.lottiefiles.com/packages/lf20_yhrzppye.json"
          class="home-hero"
        >
        </lottie-player>
        <div class="cta">
          <h1 class="text-center">Take your team to new heights.</h1>
          <router-link
            to="/board/605c6ee08defda42fc5e20ee"
            class="action-call transition"
            >Try it now!</router-link
          >
        </div>
      </div>
    </main>
    <div class="features-preview">
      <div class="features-container">
          <div class="txt-container">
            <h1>Live updates and notifications</h1>
            See every change in real time and get notifications on important
            activities.
          </div>
          <div class="img-container">
            <lottie-player
            autoplay
            loop
            mode="normal"
            speed="0.5"
            src="https://assets4.lottiefiles.com/packages/lf20_7igt36x1.json"
            class="home-hero"
          >
          </lottie-player>
          </div>
      </div>
      <div class="features-container">
          <div class="img-container">
            <lottie-player
            autoplay
            loop
            mode="normal"
            speed="0.5"
            src="https://assets5.lottiefiles.com/packages/lf20_bthb0c3o.json"
            class="home-hero"
          >
          </lottie-player>
          </div>
          <div class="txt-container">
            <h1>Work from anywhere (RESPONSIVENESS)</h1>
            Use Trellworks easily at the home, office or on the way. Trellworks
            fits your computer, tablet or phone.
          </div>
      </div>
      <div class="features-container">
          <div class="txt-container">
            <h1>Keep track of your team (DASHBOARD)</h1>
            Each board has an easilly accessable dashboard to see how your team is
            doing.
          </div>
          <div class="img-container">
            <lottie-player
            autoplay
            loop
            mode="normal"
            speed="0.5"
            src="https://assets2.lottiefiles.com/packages/lf20_mupcxbev.json"
            class="home-hero"
          >
          </lottie-player>
          </div>
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
  created() {},
  methods: {},
  components: {
    appHeader,
    boardHeader,
  },
};
</script>
