<template>
  <section class="menu">
    <i class="fas fa-times menu-close clickable" @click="closeMenu"></i>
    <h1>{{ setTitle }}</h1>
    <hr />
    <section
      v-if="!openMenu.colorMenu && !openMenu.searchTasks && !openMenu.aboutBoard && menuToggler"
      class="menu-info"
    >
      <ul>
        <li @click="toggleAboutMenu(true)">About this board</li>
        <li @click="toggleColorMenu(true)">Change background</li>
        <li @click="toggleSearchMenu(true)">Search tasks</li>
      </ul>
    </section>
    <section v-if="openMenu.searchTasks" class="search-menu">
      <h1>Search in Board</h1>
      <input
        type="text"
        placeholder="Search Tasks..."
        v-model="taskSearchTxt"
        @input="searchTasks"
      />
      <ul class="action-bar flex column">
        <section
          @click="getDetails(task)"
          class="action transition search-task-item flex column"
          v-for="task in tasksToShow"
          :key="task.id"
        >
          <h4>{{ task.title }}</h4>
          <p class="flex column">
            Created by {{ getTaskActivity(task.id).byMember.fullname }}<span class="muted-txt">{{
              time(getTaskActivity(task.id).createdAt)
            }}</span>
          </p>
        </section>
      </ul>
    </section>
    <section v-if="openMenu.colorMenu" class="color-menu">
      <div class="background-options" v-if="!colorPicker">
        <div @click="toggleColorList(true)" class="transition templates">
          <div class="templates-image"></div>
          <div class="templates-title">Photos</div>
        </div>
        <div @click="toggleColorList(false)" class="transition colors">
          <div class="colors-image"></div>
          <div class="colors-title">Colors</div>
        </div>
      </div>
      <div :style="{ width: '100%' }" v-else>
        <div v-if="!isTemplates" class="color-list">
          <li
            class="color-preview clickable"
            @click="setBoardGradient(gradient.color)"
            v-for="gradient in gradientList"
            :key="gradient.colorName"
          >
            <div :style="{ backgroundImage: gradient.color }"></div>
          </li>
          <li
            class="color-preview clickable"
            @click="setBoardColor(color.color)"
            v-for="color in colorList"
            :key="color.color"
          >
            <div :style="{ backgroundColor: color.color }"></div>
          </li>
        </div>
        <div v-else class="color-list">
          <li
            class="color-preview clickable"
            v-for="(image, idx) in 9"
            :key="idx"
            @click="setBoardTemplate(idx)"
          >
            <div class="img-container">
              <img :src="require('../../assets/img/template' + idx + '.jpg')" />
            </div>
          </li>
        </div>
      </div>
    </section>
    <section class="about-menu" v-if="openMenu.aboutBoard">
      <ul>
        <li>{{currBoard.title}}</li>
        <dashboard :isMenu="isMenu"/>
      </ul>
    </section>
    <hr>
    <i
      @click="toggleColorMenu(false)"
      v-if="!menuToggler"
      class="fas fa-angle-left back-btn clickable"
    ></i>
    <activityLog
      v-if="!openMenu.colorMenu && !openMenu.searchTasks && !openMenu.aboutBoard"
      :activities="activities"
    />
  </section>
</template>

<script>
import dashboard from '@/cmps/board/dashboard'
import { boardService } from "@/services/board.service.js";
import activityLog from "../recurring-cmps/activity-list.vue";
import moment from "moment";
export default {
  data() {
    return {
      openMenu: {
        colorMenu: false,
        searchTasks: false,
        aboutBoard: false
      },
      colorPicker: false,
      colorList: boardService.getAllColors(),
      gradientList: boardService.getAllGradients(),
      isTemplates: false,
      taskSearchTxt: "",
      tasksToShow: [],
      isMenu: true
    };
  },
  computed: {
    activities() {
      const activities = this.$store.getters.activityLog.filter((activity) => {
        return !activity.isComment;
      });
      const activitiesToShow = activities.slice(0, 25);
      return activitiesToShow;
    },
    menuToggler() {
      return this.openMenu.colorMenu || this.openMenu.searchTasks || this.openMenu.aboutBoard
        ? false
        : true;
    },
    setTitle() {
      return this.openMenu.colorMenu ? "Change background" : "Menu";
    },
    currBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
    },
  },
  methods: {
    getTaskActivity(taskId) {
      const activity = this.currBoard.activities.filter(
        (activity) => activity.task.id === taskId
      );
      return activity[0];
    },
    moment: function () {
      return moment();
    },
    time(date) {
      return moment(date).fromNow();
    },
    toggleColorMenu(colorMenuToggler) {
      this.openMenu.searchTasks = false;
      this.colorPicker = false;
      this.openMenu.aboutBoard = false;
      this.openMenu.colorMenu = colorMenuToggler;
    },
    toggleSearchMenu(colorMenuToggler) {
      this.openMenu.colorMenu = false;
      this.colorPicker = false;
      this.openMenu.aboutBoard = false;
      this.openMenu.searchTasks = colorMenuToggler;
    },
    toggleAboutMenu(aboutMenuToggler){
      this.openMenu.colorMenu = false;
      this.colorPicker = false;
      this.openMenu.searchTasks = false;   
      this.openMenu.aboutBoard = aboutMenuToggler   
    },
    getDetails(task) {
      this.$router.push(`/board/${this.currBoard._id}/details/${task.id}`);
      this.closeMenu();
    },
    toggleColorList(colorListToggler) {
      this.colorPicker = true;
      this.isTemplates = colorListToggler;
      console.log(
        "colorpicker",
        this.colorPicker,
        "istemplates",
        this.isTemplates,
        "openmenu",
        this.openMenu.colorMenu
      );
    },
    setBoardColor(color) {
      this.currBoard.styles.backgroundGradient = "";
      this.currBoard.styles.backgroundColor = color;
      this.currBoard.styles.backgroundImage = "";
      this.$store.dispatch({
        type: "updateBoard",
        editedBoard: this.currBoard,
      });
      this.$emit("bgcChanged");
    },
    setBoardTemplate(idx) {
      this.currBoard.styles.backgroundImage = idx;
      this.currBoard.styles.backgroundColor = "";
      this.currBoard.styles.backgroundGradient = "";
      this.$store.dispatch({
        type: "updateBoard",
        editedBoard: this.currBoard,
      });
      this.$emit("bgcChanged");
    },
    setBoardGradient(gradient) {
      this.currBoard.styles.backgroundColor = "";
      this.currBoard.styles.backgroundGradient = gradient;
      this.currBoard.styles.backgroundImage = "";
      this.$store.dispatch({
        type: "updateBoard",
        editedBoard: this.currBoard,
      });
      this.$emit("bgcChanged");
    },
    closeMenu() {
      this.$emit("closeMenu");
    },
    getActivities() {
      const filteredActivities = this.activities.filter((activity) => {
        return !activity.isComment;
      });
      return filteredActivities;
    },

    searchTasks() {
      const txt = this.taskSearchTxt;
      const board = this.currBoard;
      this.tasksToShow = [];
      if (!txt) return;
      board.groups.forEach((group) =>
        group.task.forEach((task) => {
          if (task.title.toLowerCase().includes(txt.toLowerCase()))
            this.tasksToShow.push(task);
        })
      );
    },
  },
  components: { activityLog, dashboard },
  created() {},
};
</script>