<template>
  <header class="flex">
    <nav class="header-btn transition">
      <router-link to="/boards">Boards</router-link>
    </nav>
    <router-link to="/">
      <span class="main-logo" aria-label="logo">Trellworks</span>
    </router-link>
    <div class="flex" v-if="loggedInUser">
      <avatar
        :style="{ marginRight: '8px' }"
        :size="30"
        :username="loggedInUser.fullname"
      ></avatar>
      <button class="header-btn" @click="doLogout">Log Out</button>
    </div>
    <section v-else class="nav-side-buttons header-btn transition">
      <router-link to="/login">Log in </router-link>
    </section>
  </header>
</template>
<script>
import Avatar from "vue-avatar";

export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  methods: {
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    },
  },
  components: { Avatar },
};
</script>