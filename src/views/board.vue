<template>
  <section
    class="board-main transition flex column"
    :class="backgroundImg"
    :style="backgroundToShow"
    v-if="currBoard"
    :board="currBoard"
  >
    <app-header />
    <board-header
      @boardTitleUpdated="updateBoardTitle"
      @changeBgc="changeBgc"
      @updateBoard="updateBoard"
      @filterBoard="changeGroupsToShow"
    />
    <div class="flex board group-container" v-dragscroll:firstchilddrag>
      <draggable
        v-model="currBoard.groups"
        class="flex"
        animation="300"
        @end="draggingEnd"
        ghostClass="group-ghost"
        handle=".handle"
        stop-propagation="true"
      >
        <group
          v-for="group in currBoard.groups"
          :key="group.id"
          :group="group"
          :board="board"
          @taskDragged="draggedTask"
          @removeGroup="removeGroup"
          @addTask="addTask"
          @titleChange="changeTitle"
          @toggleTaskCompletion="toggleTaskCompleted"
          @sortGroup="saveGroupSort"
        />
      </draggable>
      <span>
        <section
          @click="openGroupAdder"
          class="transition group group-add"
          :class="showAdd"
        >
          <section class="flex group-header add">
            <p v-if="!showGroupToAdd" class="group-title">
              <i class="fas fa-plus"></i>Add another list
            </p>
            <section
              class="add-group-title flex column"
              :class="{ 'transition-add-group': showGroupToAdd }"
              v-else
            >
              <input
                type="text"
                ref="groupAddTxt"
                @keypress.enter="addGroup"
                v-model="groupTitleToAdd"
                placeholder="Enter list title..."
              />
              <button @click="addGroup" class="btn-success">Add list</button>
              <i @mouseup="showGroupToAdd = false" class="fas fa-times"></i>
            </section>
          </section>
        </section>
      </span>
    </div>
    <router-view @updateBoardSocket="updateBoardSocket" />
    <loader v-if="isLoading" />
  </section>
</template>

<script>
import appHeader from "@/cmps/app-header";
import boardHeader from "@/cmps/board/board-header";
import group from "@/cmps/board/group";
import loader from "@/cmps/recurring-cmps/loader";
import draggable from "vuedraggable";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { boardService } from "../services/board.service.js";
import { socketService } from "@/services/socket.service";
import { utilService } from "@/services/util.service";

export default {
  data() {
    return {
      isLoading: false,
      showGroupToAdd: false,
      groupTitleToAdd: "",
      groupsToShow: [],
      menuToggler: false,
    };
  },
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    showAdd() {
      return { "show-add": this.showGroupToAdd };
    },
    currBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
    },
    board() {
      return this.$store.getters.currBoard;
    },
    backgroundToShow() {
      if (this.currBoard.styles.backgroundColor)
        return { backgroundColor: this.currBoard.styles.backgroundColor };
      else if (
        this.currBoard.styles.backgroundImage ||
        this.currBoard.styles.backgroundImage === 0
      )
        return {
          backgroundImage:
            "url(" +
            require(`@/assets/img/template${this.currBoard.styles.backgroundImage}.jpg`) +
            ")",
        };
      else return { backgroundImage: this.currBoard.styles.backgroundGradient };
    },
    backgroundImg() {
      return {
        "board-image":
          this.currBoard.styles.backgroundImage ||
          this.currBoard.styles.backgroundImage === 0,
      };
    },
  },
  methods: {
    async updateBoard(board) {
      try {
        await this.$store.dispatch({
          type: "updateBoard",
          editedBoard: board,
        });
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
          title: "Sorry, Could not update the board. " + err,
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "error",
            popup: "error",
          },
          toast: true,
          animation: true,
        });
      }
    },
    async loadBoard() {
      try {
        this.isLoading = true;
        await this.$store.dispatch({
          type: "getBoard",
          boardId: this.boardId,
        });
        this.isLoading = false;
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
          title: "Sorry, Could not load the requested board.",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "error",
            popup: "error",
          },
          toast: true,
          animation: true,
        });
      }
    },
    openGroupAdder() {
      this.showGroupToAdd = true;
      setTimeout(() => {
        this.$refs.groupAddTxt.focus();
      }, 0);
    },
    async addGroup(ev) {
      if (
        !this.groupTitleToAdd ||
        (ev.key === "Enter" && this.groupTitleToAdd.length <= 1)
      )
        return;
      const board = this.currBoard;
      const group = await boardService.getEmptyGroup();
      group.title = this.groupTitleToAdd;
      board.groups.push(group);
      this.saveActivity(
        `added the group "${group.title}" to the board`,
        board,
        group
      );
      this.groupTitleToAdd = "";
    },
    async removeGroup(groupId) {
      const board = this.currBoard;
      const groupIdx = board.groups.findIndex((group) => group.id === groupId);
      const oldGroup = JSON.parse(JSON.stringify(board.groups[groupIdx]));
      board.groups.splice(groupIdx, 1);
      try {
        this.saveActivity(
          `removed the group "${oldGroup.title}" from the board`,
          board,
          oldGroup
        );
        Swal.fire({
          position: "bottom-end",
          title: "Removed successfully",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "success",
            popup: "success",
          },
          toast: true,
          animation: true,
        });
      } catch (err) {
        console.log("hi", err);
      }
    },
    async addTask(task, groupId) {
      const board = this.currBoard;
      const group = board.groups.find((group) => group.id === groupId);
      group.task.push(task);
      this.saveActivity(
        `added the task "${task.title}" in "${group.title}"`,
        board,
        group,
        task
      );
    },
    async saveActivity(
      activityTitle,
      board,
      group,
      task = { title: "", id: "" }
    ) {
      board.activities.unshift({
        byMember: this.loggedInUser || { fullname: "Guest" },
        title: activityTitle,
        createdAt: Date.now(),
        group: group.title,
        id: utilService.makeId(),
        task: {
          id: task.id,
          title: task.title,
        },
      });
      await this.updateBoard(board);
      socketService.emit("board update", board);
    },
    async changeBgc() {
      this.saveActivity(
        "changed this board`s background color",
        this.currBoard,
        {}
      );
    },
    async draggingEnd() {
      const board = this.currBoard;
      board.groups = this.currBoard.groups;
      await this.updateBoard(board);
      socketService.emit("board update", board);
    },
    async draggedTask(board) {
      await this.updateBoard(board);
      socketService.emit("board update", board);
    },
    async changeTitle(newTitle, groupId) {
      const board = this.currBoard;
      const group = board.groups.find((group) => group.id === groupId);
      const groupCopy = JSON.parse(JSON.stringify(group));
      group.title = newTitle;
      this.saveActivity(`renamed a group in the board`, board, groupCopy);
    },
    async updateBoardTitle(newTitle) {
      this.currBoard.title = newTitle;
      this.saveActivity("changed this board`s name", this.currBoard, {});
    },
    async toggleTaskCompleted(group, task) {
      const board = this.currBoard;
      const groupIdx = board.groups.findIndex(
        (foundGroup) => group.id === foundGroup.id
      );
      board.groups.splice(groupIdx, 1, group);
      this.saveActivity(
        `marked the task "${task.title}" as completed`,
        board,
        group,
        task
      );
    },
    async updateBoardSocket(board) {
      try {
        await socketService.emit("board update", board);
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
          title: "Sorry, There was a problem reaching the server.",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "error",
            popup: "error",
          },
          toast: true,
          animation: true,
        });
      }
    },
    saveGroupSort(groupCopy) {
      const board = this.currBoard;
      const idx = board.groups.findIndex((group) => group.id === groupCopy.id);
      board.groups.splice(idx, 1, groupCopy);
      this.updateBoard(board);
    },
    changeGroupsToShow(groupsToShow) {
      this.groupsToShow = groupsToShow;
    },
    setMenuToggler(boolean) {
      this.menuToggler = boolean;
    },
  },
  async created() {
    // document.addEventListener("mousedown", (ev) => {
    // 	if (!ev.target.closest(".quickmenu-popup")) {
    // 		this.menuToggler = false
    // 	}
    // })
    await this.loadBoard();
    socketService.setup();
    socketService.on("board updated", (board) => {
      this.updateBoard(board);
    });
  },
  destroyed() {
    socketService.off("board updated", this.updateBoard);
    socketService.terminate();
  },
  components: {
    boardHeader,
    group,
    draggable,
    appHeader,
    loader,
  },
};
</script>