<template>
  <header class="flex">
    <nav class="flex">
      <router-link class="header-btn transition" to="/">Home</router-link>
      <router-link class="header-btn transition" to="/boards">Boards</router-link>
    </nav>
    <router-link  to="/">
    <span class="main-logo" aria-label="logo">Trellworks</span>
    </router-link>
    <section class="nav-side-buttons header-btn transition">
      <router-link to="/login">Login / Signup</router-link>

    </section>
  </header>
</template>
<script>
export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    }
  },
};
</script>