<template>
  <div class="flex board-header">
    <div class="flex header-container" @submit.prevent="editBoardTitle">
      <input
        class="clean-input"
        v-model="currBoard.title"
        v-if="isEditing"
        ref="titleInput"
        @keypress.enter="editBoardTitle"
        @focusout="editBoardTitle"
        maxlength="30"
      />
      <h2 @click="getInput" v-else class="board-title">
        {{ currBoard.title }}
      </h2>
      <button class="header-btn star" @click="starBoard">
        <i v-if="!currBoard.isStarred" class="far fa-star"></i
        ><i v-else class="fas fa-star"></i>
      </button>
      <ul class="flex avatars-show" v-if="boardMembers.length">
        <span
          v-for="user in boardMembers"
          :key="user._id"
          class="clickable transition board-header-avatar"
          @click="showProfile(user)"
          ><userPic @userClicked="currMember = user" :user="user" :size="30"
        /></span>
        <div
          v-if="showMemberProfile"
          @click="showMemberProfile = false"
          class="pop-up-window"
        ></div>
        <memberProfile
          :currMember="currMember"
          v-if="showMemberProfile"
          @closeProfile="hideProfile"
        />
      </ul>
      <button class="header-btn invite" @click="showUsers">
        <span class="invite-members"></span>
      </button>
    </div>
    <button
      @click="dashboardShown = !dashboardShown"
      class="header-btn btn-dashboard"
    >
      <i class="fas fa-chart-bar"></i>
    </button>
    <div
      class="pop-up-window"
      v-if="dashboardShown"
      @click="dashboardShown = false"
    ></div>
    <dashboard v-if="dashboardShown"></dashboard
    ><el-badge
      v-if="userAlerts > 0"
      :value="userAlerts"
      :max="10"
      class="item menu-alert"
    /><button @click="toggleMenu" class="header-btn menu">
      <span class="show-menu"></span></button
    ><transition name="slide-from-right"
      ><boardMenu
        class="board-menu"
        v-if="menuShown"
        @closeMenu="menuShown = !menuShown"
        @bgcChanged="bgcChanged"
      ></boardMenu
    ></transition>
    <div
      :class="{ 'pop-up-window': userWindow }"
      @mousedown.self="userWindow = !userWindow"
    >
      <div
        v-if="userWindow"
        :style="setCurrPos"
        ref="inviteMembers"
        class="pop-up"
      >
        <h3 class="pop-up-title">Invite to board</h3>
        <hr />
        <input
          type="text"
          v-model="memberSearchTxt"
          placeholder="Search Trellworks members..."
        /><span v-if="!memberSearchTxt"
          ><h3 class="pop-up-title">Suggested users</h3>
          <li
            v-for="(user, idx) in suggestedUsers"
            @click="toggleBoardMember(user)"
            :key="idx"
            class="search-members flex"
          >
            <span class="flex"
              ><userPic :user="user" :size="30" /><i
                v-if="isUserInBoard(user._id)"
                class="fas fa-check"
              ></i
            ></span>
            {{ user.fullname }}
          </li></span
        >
        <div>
          <li
            v-for="user in filteredMembers"
            @click="toggleBoardMember(user)"
            :key="user._id"
            class="search-members flex"
          >
            <span class="flex"
              ><userPic :user="user" :size="30" /><i
                v-if="isUserInBoard(user._id)"
                class="fas fa-check"
              ></i
            ></span>
            {{ user.fullname }}
          </li>
        </div>
        <hr />
        <h3 class="pop-up-title">In This Board</h3>
        <div>
          <li
            v-for="(user, idx) in boardMembers"
            :key="idx"
            class="search-members flex"
            @click="toggleBoardMember(user)"
          >
            <span class="flex"
              ><userPic :user="user" :size="30" /><i
                v-if="isUserInBoard(user._id)"
                class="fas fa-check"
              ></i
            ></span>
            {{ user.fullname }}

            <span v-if="!boardMembers.length">Currently no users</span>
          </li>
        </div>
      </div>
    </div>
  </div>
</template><script>
import boardMenu from "./menu.vue";
import dashboard from "./dashboard.vue";

import { utilService } from "@/services/util.service.js";
import memberProfile from "../recurring-cmps/user-miniprofile.vue";
import userPic from "../recurring-cmps/user-pic.vue";

export default {
  data() {
    return {
      dashboardShown: false,
      menuShown: false,
      isEditing: false,
      showMemberProfile: false,
      currMember: null,
      userWindow: false,
      memberSearchTxt: "",
      setPos: {
        x: 0,
        y: 0,
      },

      currClientHeight: 0,
      popUpHeight: 0,
      userAlerts: 0,
    };
  },

  computed: {
    boardMembers() {
      return this.$store.getters.currBoardMembers;
    },

    users() {
      return this.$store.getters.users;
    },

    currBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
    },

    filteredMembers() {
      if (!this.memberSearchTxt) return;
      return this.users.filter((user) =>
        user.fullname.toLowerCase().includes(this.memberSearchTxt.toLowerCase())
      );
    },

    suggestedUsers() {
      const randomUsers = [];

      for (let i = 0; i < 4; i++) {
        randomUsers.push(
          this.users[utilService.getRandomInt(0, this.users.length)]
        );
      }

      return randomUsers;
    },

    setCurrPos() {
      return {
        left: this.setPos.x + "px",
        top: this.setPos.y + "px",
      };
    },

    loggedInUser() {
      return JSON.parse(JSON.stringify(this.$store.getters.loggedinUser));
    },
  },

  methods: {
    updateUserAlerts() {
      const user = this.loggedInUser;
      if (!user || user === []) return;
      if (user.notifications)
        this.userAlerts = user.notifications.alerts.length;
    },

    bgcChanged() {
      this.$emit("changeBgc");
    },

    async loadUsers() {
      await this.$store.dispatch({
        type: "loadUsers",
      });
    },

    editBoardTitle() {
      this.isEditing = !this.isEditing;
      this.$emit("boardTitleUpdated", this.currBoard.title);
    },

    showProfile(member) {
      this.currMember = member;
      this.showMemberProfile = true;
    },

    hideProfile() {
      this.showMemberProfile = false;
    },

    getInput() {
      this.isEditing = !this.isEditing;

      setTimeout(
        () => {
          this.$refs.titleInput.focus();
        },

        0
      );
    },

    showUsers(ev) {
      this.memberSearchTxt = "";
      this.userWindow = !this.userWindow;

      setTimeout(
        () => {
          this.popUpHeight = this.$refs.inviteMembers.clientHeight;
          this.calcPos(ev);
          if (this.currClientHeight - this.setPos.y < this.popUpHeight)
            this.setPos.y -= 50;
          if (
            this.currClientHeight - this.setPos.y < this.popUpHeight &&
            this.currClientHeight + this.setPos.y > this.popUpHeight
          )
            return;
          else this.setPos.y += this.popUpHeight / 2;
        },

        0
      );
    },

    calcPos(ev) {
      this.currClientHeight = ev.view.innerHeight;
      this.currClientWidth = ev.view.innerWidth;

      if (this.currClientWidth !== ev.view.innerWidth) {
        this.setPos.x = ev.pageX + 150;
      }

      this.setPos.y = ev.pageY;
      this.setPos.x = ev.pageX + 150;
    },

    toggleBoardMember(user, ev) {
      const foundIdx = this.currBoard.members.findIndex(
        (member) => member._id === user._id
      );

      if (foundIdx !== -1) {
        this.currBoard.members.splice(foundIdx, 1);
        return this.$emit("updateBoard", this.currBoard);
      }

      this.currBoard.members.push(user);
      this.$emit("updateBoard", this.currBoard);
    },

    starBoard() {
      this.currBoard.isStarred = !this.currBoard.isStarred;
      this.$emit("updateBoard", this.currBoard);
    },

    isUserInBoard(userId) {
      const user = this.currBoard.members.find(
        (boardUser) => boardUser._id === userId
      );
      if (user) return true;
      else return false;
    },

    toggleMenu() {
      this.menuShown = !this.menuShown;
      const user = this.loggedInUser;
      if (!user || user === []) return;

      if (user.notifications) {
        user.notifications.alerts = [];

        this.$store.dispatch({
          type: "updateUser",
          user,
        });
        this.updateUserAlerts();
      }
    },
  },

  async created() {
    await this.loadUsers();
    this.updateUserAlerts();
  },

  watch: {
    loggedInUser() {
      this.updateUserAlerts();
    },
  },

  destroyed() {
    this.memberSearchTxt = "";
  },

  components: {
    boardMenu,
    memberProfile,
    dashboard,
    userPic,
  },
};
</script>