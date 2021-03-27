<template>
  <section>
    <app-header />
    <div class="flex main-container gallery">
      <h1 style="font-weight:400"><i class="fas fa-star"></i> Starred Boards</h1>
      <div class="board-list">
        <section v-for="board in starredBoards" :key="board._id">
          <span @click="getBoard(board._id)">
            <div
              :style="getBackground(board.styles)"
              class="transition placeholder-preview"
            >
              <div class="board-header flex">
                <span class="board-title">{{ board.title }}</span>
                <i
                  @click.stop="removeBoard(board._id)"
                  class="far fa-trash-alt transition"
                ></i>
              </div>
            </div>
          </span>
        </section>
      </div>
      <h1 style="font-weight:400"><i class="fas fa-th"></i> Your boards</h1>
      <div class="board-list">
        <div
          @click="createBoard"
          class="placeholder-preview add-board-container"
        >
          <i class="fas fa-plus"></i>
        </div>
        <section v-for="board in regularBoards" :key="board._id">
          <span @click="getBoard(board._id)">
            <div
              :style="getBackground(board.styles)"
              class="transition placeholder-preview"
            >
              <div class="board-header flex">
                <span class="board-title">{{ board.title }}</span>
                <i
                  @click.stop="removeBoard(board._id)"
                  class="far fa-trash-alt transition"
                ></i>
              </div>
            </div>
          </span>
        </section>
      </div>
    </div>
    <loader v-if="isLoading" />
  </section>
</template>

<script>
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import appHeader from "@/cmps/app-header";
import loader from "@/cmps/recurring-cmps/loader";
export default {
  data() {
    return {
      isLoading: false,
      starredBoards: null,
      regularBoards: null,
    };
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  methods: {
    getBackground(boardStyles) {
      if (boardStyles.backgroundColor)
        return { backgroundColor: boardStyles.backgroundColor };
      else if (boardStyles.backgroundImage || boardStyles.backgroundImage === 0)
        return {
          backgroundImage:
            "url(" +
            require(`@/assets/img/template${boardStyles.backgroundImage}.jpg`) +
            ")",
        };
      else return { backgroundImage: boardStyles.backgroundGradient };
    },
    setBoards() {
      this.starredBoards = this.boards.filter((board) => board.isStarred);
      this.regularBoards = this.boards.filter((board) => !board.isStarred);
    },
    async loadBoards() {
      try {
        this.isLoading = true;
        await this.$store.dispatch({
          type: "loadBoards",
        });
        this.isLoading = false;
        this.setBoards();
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
          title: "Sorry, could not load boards.",
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
    async createBoard() {
      const loggedUser = this.loggedInUser || { fullname: "Guest" ,_id:"000"};
      await this.$store.dispatch({
        type: "newBoard",
        loggedUser,
      });
      await this.loadBoards();
      await this.$store.dispatch({
        type: "getBoard",
        boardId: this.boards[this.boards.length - 1]._id,
      });
      this.$router.push("/board/" + this.boards[this.boards.length - 1]._id);
    },
    async removeBoard(boardId) {
      await this.$store.dispatch({
        type: "removeBoard",
        boardId,
      });
      await this.loadBoards();
    },
    async getBoard(boardId) {
      await this.$store.dispatch({ type: "getBoard", boardId: boardId });
      const board = this.$store.getters.currBoard;
      this.$router.push("/board/" + board._id);
    },
  },
  async created() {
    await this.loadBoards();
    this.setBoards();
  },
  components: {
    appHeader,
    loader,
  },
};
</script>