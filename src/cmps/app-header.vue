<template>
  <header class="flex">
    <nav class="flex">
      <router-link class="header-btn transition" to="/boards"
        >Boards</router-link
      >
    </nav>
    <router-link to="/">
      <span class="main-logo" aria-label="logo">Trellworks</span>
    </router-link>
    <div class="flex" v-if="loggedInUser">
      <avatar @click.native="togglePopUp(true)" :style="{marginRight: '8px'}" :size="30" class="clickable" :username="loggedInUser.fullname"></avatar>
      <button class="header-btn" @click="doLogout">Log Out</button>
    </div>
    <section v-else class="nav-side-buttons header-btn transition">
      <router-link to="/login">Log in </router-link>
    </section>
    <section v-if="popUpToggle" class="pop-up">
      <h3 class="pop-up-title">User profile</h3>
      <hr>
      <ul class="about-user">
        <li class="profile">
          <div>
            <avatar :size="40" :username="loggedInUser.fullname"></avatar>
            <label for="file-upload"><small>Edit profile image</small></label>
            <input type="file" id="file-upload" :style="{display: 'none'}" @change="updateProfileImage">
          </div>
          <div class="name-profile">
            <span>{{loggedInUser.fullname}}</span>
            <small>Created at: </small>
          </div>
        </li>
        <li>log out will be here</li>
      </ul>
    </section>
    <div v-if="popUpToggle" @click="togglePopUp(false)" class="pop-up-window"></div>
  </header>
</template>
<script>
import Avatar from "vue-avatar";
import { uploadImg } from "@/services/img-upload.service"

export default {
  data(){
    return {
      popUpToggle: false,
    }
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
    togglePopUp(toggler){
      this.popUpToggle = toggler
    },
    async updateProfileImage(ev){
      const imgUploaded = await uploadImg(ev);
      this.loggedInUser.profileImg = imgUploaded.url
      this.$store.dispatch({type: 'updateUser', user: this.loggedInUser})
    }
  },
  components: { Avatar },
  created(){

  }
};
</script>