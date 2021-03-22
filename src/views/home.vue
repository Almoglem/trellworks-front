<template>
  <section class="container home text-center">
    <app-header />
    <img src="../assets/img/main.jpg" class="main-img" />
    <h5 class="text-center">Manage your tasks easily</h5>
    <router-link to="/board/YhGzf" class="action-call">Try it now!</router-link>
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
    boards(){
      this.$store.getters.boards
    }
  },
  created() {},
  methods: {},
  components: {
    appHeader,
    boardHeader,
  },
};
</script>
