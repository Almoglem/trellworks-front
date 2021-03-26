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
				class="user-profileimg"
				:src="loggedInUser.profileImg"
				alt=""
			/>
			<avatar v-else :size="30" :username="loggedInUser.fullname"></avatar>
      <button class="header-btn" @click="doLogout">Log Out</button>
    </div>
    <section v-else class="nav-side-buttons header-btn transition">
      <router-link to="/login">Log in </router-link>
    </section>
    <section v-if="popUpToggle" class="pop-up">
      <h3 class="pop-up-title">User profile</h3>
      <hr />
      <ul class="about-user">
        <li class="profile">
          <div>
            		<img
				v-if="loggedInUser.profileImg"
				class="user-profileimg"
				:src="loggedInUser.profileImg"
				alt=""
			/>
			<avatar v-else :size="30" :username="loggedInUser.fullname"></avatar>
            <label for="file-upload"><small>Edit profile image</small></label>
            <input
              type="file"
              id="file-upload"
              :style="{ display: 'none' }"
              @change="updateProfileImage"
            />
          </div>
          <div class="name-profile">
            <span>{{ loggedInUser.fullname }}</span>
            <small>Created at: </small>
          </div>
        </li>
        <li>log out will be here</li>
      </ul>
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
import { uploadImg } from "@/services/img-upload.service";

export default {
  data() {
    return {
      popUpToggle: false,
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
      this.popUpToggle = toggler;
    },
    async updateProfileImage(ev) {
      try {
        const imgUploaded = await uploadImg(ev);
        this.loggedInUser.profileImg = imgUploaded.url;
        this.$store.dispatch({
          type: "updateUser",
          user: this.loggedInUser,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  components: { Avatar },
  created() {
    console.log(this.loggedInUser);
  },
};
</script>