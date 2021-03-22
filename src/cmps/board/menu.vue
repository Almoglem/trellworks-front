<template>
  <section class="menu">
    <i class="fas fa-times menu-close clickable" @click="closeMenu"></i>
    <h1>{{ setTitle }}</h1>
    <hr />
    <section v-if="menuToggler" class="menu-info">
      <ul>
        <li>About this board</li>
        <li @click="toggleColorMenu(true)">Change background</li>
        <li>Search tasks</li>
      </ul>
      <activityLog :activities="activities" />
    </section>
    <section v-else class="color-menu">
      <div class="background-options" v-if="!colorPicker">
        <div class="templates">
          <div class="templates-image"></div>
          <div class="templates-title">Photos</div>
        </div>
        <div @click="toggleColorList(true)" class="colors">
          <div class="colors-image"></div>
          <div class="colors-title">Colors</div>
        </div>
      </div>
      <div class="color-list" v-else>
        <li
          class="color-preview clickable"
          @click="setBoardColor(color.color)"
          v-for="color in colorList"
          :key="color.color"
        >
          <div :style="{ backgroundColor: color.color }"></div>
        </li>
      </div>
    </section>
    <i
      @click="toggleColorMenu(false)"
      v-if="!menuToggler"
      class="fas fa-angle-left back-btn clickable"
    ></i>
  </section>
</template>

<script>
import { boardService } from "@/services/board.service.js";
import activityLog from "../recurring-cmps/activity-list.vue";
export default {
  data() {
    return {
      openMenu: {
        colorMenu: false,
      },
      colorPicker: false,
      colorList: boardService.getAllColors(),
    };
  },
  computed: {
    activities() {
      return this.$store.getters.activityLog;
    },
    menuToggler() {
      return this.openMenu.colorMenu ? false : true;
    },
    setTitle() {
      return this.openMenu.colorMenu ? "Change background" : "Menu";
    },
    currBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
    },
  },
  methods: {
    moment: function () {
      return moment();
    },
    time(date) {
      return moment(date).fromNow();
    },
    toggleColorMenu(colorMenuToggler) {
      this.openMenu.colorMenu = colorMenuToggler;
      this.colorPicker = false;
    },
    toggleColorList(colorListToggler) {
      this.colorPicker = colorListToggler;
    },
    setBoardColor(color) {
      this.currBoard.styles.backgroundColor = color;
      this.$store.dispatch({
        type: "saveBoardChanges",
        editedBoard: this.currBoard,
      });
      this.$emit('bgcChanged')
    },
    closeMenu() {
      this.$emit("closeMenu");
    },
  },
  components: { activityLog },
  created() {},
};
</script>