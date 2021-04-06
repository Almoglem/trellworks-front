<template>
  <section>
    <app-header />
    <div class="flex main-container gallery">
      <h1 style="font-weight: 400">
        <i class="fas fa-star"></i> Starred Boards
      </h1>
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
      <h1 style="font-weight: 400"><i class="fas fa-th"></i> Your boards</h1>
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
import { utilService } from "../services/util.service";
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
        this.setBoards();
      } catch (err) {
        utilService.showSuccessMsg("Sorry, could not load boards.");
      } finally {
        this.isLoading = false;
      }
    },
    async createBoard() {
      const loggedUser = this.loggedInUser || { fullname: "Guest", _id: "000" };
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
      if (!this.loggedInUser) {
        utilService.showErrorMsg(
          "Sorry, you must be logged in to delete a board"
        );
        return;
      }
      if (
        boardId === "6062231855c6426f8c7ab2e1" ||
        boardId === "60632833f0c8d3001556781b" ||
        (boardId === "606212907ad16945f0800c7f" && !this.loggedInUser.isAdmin)
      ) {
        utilService.showErrorMsg(
          "Sorry, you are not eligable to delete this board"
        );
        return;
      }
      try {
        await this.$store.dispatch({
          type: "removeBoard",
          boardId,
        });
        await this.loadBoards();
      } catch (err) {
        utilService.showErrorMsg(err);
      }
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