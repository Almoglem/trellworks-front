<template>
  <header class="flex">
    <nav class="header-btn transition">
      <router-link to="/boards">Boards</router-link>
    </nav>
    <router-link to="/">
      <span class="main-logo" aria-label="logo">Trellworks</span>
    </router-link>

    <div class="flex" v-if="loggedInUser">
      <userPic
        class="clickable"
        :size="30"
        :user="loggedInUser"
        @userClicked="togglePopUp(true)"
      />
      <section v-if="popUpToggle" class="pop-up about">
        <h3 class="pop-up-title">User profile</h3>
        <hr />
        <ul class="about-user">
          <li class="profile flex column">
            <section class="appheader-profile flex column">
              <userPic
                class="appheader-profile"
                :size="50"
                :user="loggedInUser"
              />
              <span>{{ loggedInUser.fullname }}</span>
              <small>Member since: {{ time(loggedInUser.createdAt) }} </small>
            </section>
            <div class="avatar-profile action-bar flex column">
              <label for="file-upload"
                ><small class="transition action details-title"
                  >Edit Profile Image</small
                ></label
              >
              <input
                type="file"
                id="file-upload"
                :style="{ display: 'none' }"
                @change="updateProfileImage"
              />
            </div>

            <hr />

            <button class="btn-gray" @click="doLogout">Log Out</button>
          </li>
        </ul>
      </section>
    </div>
    <section v-else class="nav-side-buttons header-btn transition">
      <router-link to="/login">Log in </router-link>
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
import { utilService } from "@/services/util.service";
import { uploadImg } from "@/services/img-upload.service";
import loader from "@/cmps/recurring-cmps/loader";
import userPic from "./recurring-cmps/user-pic.vue";
import moment from "moment";

export default {
  data() {
    return {
      popUpToggle: false,
      isLoading: false,
    };
  },
  computed: {
    loggedInUser() {
      return JSON.parse(JSON.stringify(this.$store.getters.loggedinUser));
    },
  },
  methods: {
    moment: function () {
      return moment();
    },
    time(date) {
      return moment(date).format("DD.MM.YYYY");
    },
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    },
    togglePopUp(isShown) {
      this.popUpToggle = isShown;
    },
    async updateProfileImage(ev) {
      this.isLoading = true;
      try {
        const imgUploaded = await uploadImg(ev);
        this.loggedInUser.profileImg = imgUploaded.url;
        this.$store.dispatch({
          type: "updateUser",
          user: this.loggedInUser,
        });
      } catch (err) {
        utilService.showErrorMsg(
          "Sorry, There was a problem with uploading your image."
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
  components: { loader, userPic },
};
</script>