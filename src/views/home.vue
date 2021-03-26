<template>
  <section class="container home text-center">
    <app-header />
    <main class="page-content">
      <img src="../assets/img/option2.png" class="main-img" />
      <h5 class="text-center">Manage your tasks easily</h5>
      <router-link to="/board/605c6ee08defda42fc5e20ee" class="action-call"
        >Try it now!</router-link
      >
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
  created() {},
  methods: {},
  components: {
    appHeader,
    boardHeader,
  },
};
</script>
