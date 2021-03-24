<template>
  <section
    class="board-main"
    :style="{ backgroundColor: currBoard.styles.backgroundColor }"
    v-if="currBoard"
    :board="currBoard"
  >
    <app-header />
    <board-header
      :boardTitle="currBoard.title"
      @boardTitleUpdated="updateBoardTitle"
      @changeBgc="bgcChanged"
      @updateBoard="updateBoard"
    />
    <div class="flex board">
      <div class="flex group-container">
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
            :board="currBoard"
            @taskDragged="draggedTask"
            @removeGroup="removeGroup"
            @addTask="addTask"
            @titleChange="changeTitle"
            @toggleTaskCompletion="toggleTaskCompleted"
          />
        </draggable>
        <section @click="addGroup" class="transition group group-add">
          <section class="flex group-header">
            <p class="group-title">
              <i class="fas fa-plus"></i>Add another list
            </p>
          </section>
        </section>
      </div>
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
    };
  },
  computed: {
    boardId() {
      return this.$route.params.boardId;
    },
    currBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  methods: {
    async updateBoard(board) {
      try {
        await this.$store.dispatch({
          type: "saveBoardChanges",
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
    async addGroup() {
      const board = this.currBoard;
      const group = await boardService.getEmptyGroup();
      board.groups.push(group);
      this.saveActivity(
        `added the group "${group.title}" to the board`,
        board,
        group
      );
      await this.updateBoard(board);
      socketService.emit("board update", board);
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
        await this.updateBoard(board);
        socketService.emit("board update", board);
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
      await this.updateBoard(board);
      socketService.emit("board update", board);
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
    },

    async bgcChanged() {
      this.saveActivity(
        "changed this board`s background color",
        this.currBoard,
        {}
      );
      await this.updateBoard(this.currBoard);
      socketService.emit("board update", this.currBoard);
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
      await this.updateBoard(board);
      socketService.emit("board update", board);
    },
    async updateBoardTitle(newTitle) {
      this.currBoard.title = newTitle;
      this.saveActivity("changed this board`s name", this.currBoard, {});
      await this.updateBoard(this.currBoard);
      socketService.emit("board update", this.currBoard);
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
        await this.updateBoard(board);
        socketService.emit("board update", board);
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
  },
  async created() {
    await this.loadBoard();
    socketService.setup();
    socketService.on("board updated", (board) => {
      this.updateBoard(board);
    });
  },
  destroyed(){
    socketService.off('board updated',  (board) => {
      this.updateBoard(board);
    });
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