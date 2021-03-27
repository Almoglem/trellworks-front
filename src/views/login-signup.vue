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
      <h2>Register</h2>
      <div class="form">
        <form @submit.prevent="doSignup">
          <label>
            *Enter your full name
            <input
              type="text"
              v-model="signupCred.fullname"
              placeholder="Your full name"
            />
          </label>
          <label>
            *Enter password
            <input
              type="password"
              v-model="signupCred.password"
              placeholder="Password"
            />
          </label>
          <label>
            *Enter your username
            <input
              type="text"
              v-model="signupCred.username"
              placeholder="Username"
            />
          </label>
          <button :style="{ display: 'none' }" type="submit">Signup</button>
        </form>
        <div class="profile-image">
          <label for="file-upload">
            <div :style="profileToShow" class="image">
              <img
                v-if="!this.signupCred.profileImg"
                src="../assets/img/profile-img.png"
              />
              <img v-else :src="profileToShow" />
            </div>
            <a class="clickable">Add a profile image</a>
          </label>
          <input
            type="file"
            id="file-upload"
            :style="{ display: 'none' }"
            @change="addProfileImage"
          />
        </div>
      </div>
      <button @click="doSignup">Sign up</button>
      <span
        >Have an account?
        <span class="clickable bold" @click="isLogin = true">Log in</span>
      </span>
    </div>
    <loader v-if="isLoading" />
  </section>
</template><script>
import appHeader from "@/cmps/app-header";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import loader from "@/cmps/recurring-cmps/loader";
import { uploadImg } from "@/services/img-upload.service";

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
        profileImg: "",
      },
      isLogin: true,
      isLoading: false
    };
  },

  computed: {
    users() {
      return this.$store.getters.users;
    },

    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },

    profileToShow() {
      return this.signupCred.profileImg;
    }
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
    async addProfileImage(ev) {
      this.isLoading = true
      try{
        const imgUploaded = await uploadImg(ev);
        this.signupCred.profileImg = imgUploaded.url;
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
            title: "Sorry, There was a problem with uploading your image.",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              title: "error",
              popup: "error",
            },
            toast: true,
            animation: true,
        });
      } finally {
        this.isLoading = false
      }
    },
  },
  components: {
    loader,
    appHeader,
  },
};
</script>