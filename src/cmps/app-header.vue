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
        @click.native="togglePopUp(true)"
        :style="{ marginRight: '8px' }"
        :size="30"
        class="clickable"
        :username="loggedInUser.fullname"
      ></avatar>
      <button class="header-btn" @click="doLogout">Log Out</button>
    </div>
    <section v-else class="nav-side-buttons header-btn transition">
      <router-link to="/login">Log in </router-link>
    </section>
    <section v-if="popUpToggle" ref="popUp" class="pop-up">
      <li>do pris</li>
      <li>do pras</li>
    </section>
    <div
      v-if="popUpToggle"
      @click="togglePopUp(false)"
      class="pop-up-window"
    ></div>
  </header>
</template>
<script>
import Avatar from "vue-avatar";

export default {
  data() {
    return {
      popUpToggle: false,
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  methods: {
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    },
    togglePopUp(toggler) {
      this.popUpToggle = toggler;
    },
  },
  components: { Avatar },
};
</script>