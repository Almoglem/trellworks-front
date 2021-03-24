<template>
  <section class="login-signup">
    <appHeader />
    <p>{{ msg }}</p>
    <div v-if="isLogin" class="form-wrapper">
      <form @submit.prevent="doLogin">
        <h2>Login</h2>
        <input
          type="text"
          v-model="loginCred.username"
          placeholder="User name"
        /><input
          type="password"
          v-model="loginCred.password"
          placeholder="Password"
        /><button type="submit">Login</button>
      </form>
      <span
        >Don't have an account?
        <span class="clickable bold" @click="isLogin = false"
          >Sign Up</span
        ></span
      >
    </div>
    <div v-else class="form-wrapper">
      <form @submit.prevent="doSignup">
        <h2>Signup</h2>
        <input
          type="text"
          v-model="signupCred.fullname"
          placeholder="Your full name"
        /><input
          type="password"
          v-model="signupCred.password"
          placeholder="Password"
        /><input
          type="text"
          v-model="signupCred.username"
          placeholder="Username"
        /><button type="submit">Signup</button>
      </form>
      <span
        >Have an account?
        <span class="clickable bold" @click="isLogin = true">Log in</span></span
      >
    </div>
  </section>
</template><script>
import appHeader from "@/cmps/app-header";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import loader from "@/cmps/recurring-cmps/loader";

export default {
  name: "test",
  data() {
    return {
      msg: "",
      loginCred: {
        username: "",
        password: "",
      },

      signupCred: {
        username: "",
        password: "",
        fullname: "",
      },

      isLogin: true,
    };
  },

  computed: {
    users() {
      return this.$store.getters.users;
    },

    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
  },

  created() {
    this.loadUsers();
  },

  methods: {
    async doLogin() {
      if (!this.loginCred.username || !this.loginCred.password) {
        this.msg = "Please enter username/password";
        return;
      }

      try {
        await this.$store.dispatch({
          type: "login",
          userCred: this.loginCred,
        });
        this.$router.push("/");
      } catch (err) {
        console.log(err);
        this.msg = "Failed to log in.";
      }
    },

    async doSignup() {
      if (
        !this.signupCred.fullname ||
        !this.signupCred.password ||
        !this.signupCred.username
      ) {
        this.msg = "Please fill up the form";
        return;
      }

      await this.$store.dispatch({
        type: "signup",
        userCred: this.signupCred,
      });
      this.$router.push("/");
    },

    loadUsers() {
      this.$store.dispatch({
        type: "loadUsers",
      });
    },

    async removeUser(userId) {
      try {
        await this.$store.dispatch({
          type: "removeUser",
          userId,
        });
        this.msg = "User removed";
      } catch (err) {
        this.msg = "Failed to remove user";
      }
    },
  },

  components: {
    loader,
    appHeader,
  },
};
</script>