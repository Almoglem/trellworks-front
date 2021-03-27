<template>
  <header class="flex">
    <nav class="header-btn transition">
      <router-link to="/boards">Boards</router-link>
    </nav>
    <router-link to="/">
      <span class="main-logo" aria-label="logo">Trellworks</span>
    </router-link>
    
    <div class="flex" v-if="loggedInUser">
      <img
        v-if="loggedInUser.profileImg"
        @click="togglePopUp(true)"
        class="user-profileimg"
        :src="loggedInUser.profileImg"
        alt=""
      />
      <avatar
        v-else
        @click.native="togglePopUp(true)"
        :size="30"
        :username="loggedInUser.fullname"
      ></avatar>

      <!-- <button class="header-btn" @click="doLogout">Log Out</button> -->
    </div>
    <section v-else class="nav-side-buttons header-btn transition">
      <router-link to="/login">Log in </router-link>
    </section>
    <section v-if="popUpToggle" class="pop-up">
      <h3 class="pop-up-title">User profile</h3>
      <hr />
      <ul class="about-user">
        <li class="profile">
          <div class="name-profile">
            <span>{{ loggedInUser.fullname }}</span>
            <small>User since: </small>
          </div>
          <div class="avatar-profile">
            <img
              v-if="loggedInUser.profileImg"
              class="user-profileimg"
              :src="loggedInUser.profileImg"
              alt=""
            />
            <avatar
              v-else
              :size="30"
              :username="loggedInUser.fullname"
            ></avatar>
            <label for="file-upload"><small>Edit profile image</small></label>
            <input
              type="file"
              id="file-upload"
              :style="{ display: 'none' }"
              @change="updateProfileImage"
            />
          </div>
        </li> 
        <hr>
        <li class="link">
          <a @click="doLogout">Log out</a>
        </li>
      </ul>
    </section>
    <div
      v-if="popUpToggle"
      @click="togglePopUp(false)"
      class="pop-up-window"
    ></div>
    <loader v-if="isLoading" />
  </header>
</template>
<script>
import Avatar from "vue-avatar";
import { uploadImg } from "@/services/img-upload.service";
import loader from "@/cmps/recurring-cmps/loader";
export default {
  data() {
    return {
      popUpToggle: false,
      isLoading: false
    };
  },
  computed: {
    loggedInUser() {
      return JSON.parse(JSON.stringify(this.$store.getters.loggedinUser));
    },
  },
  methods: {
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    },
    togglePopUp(toggler) {
      console.log("hi");
      this.popUpToggle = toggler;
    },
    async updateProfileImage(ev) {
      this.isLoading = true
      try {
        const imgUploaded = await uploadImg(ev);
        this.loggedInUser.profileImg = imgUploaded.url;
        this.$store.dispatch({
          type: "updateUser",
          user: this.loggedInUser,
        });
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
  components: { Avatar, loader },
  created() {
    console.log(this.loggedInUser);
  },
};
</script>