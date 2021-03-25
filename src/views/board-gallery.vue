<template>
	<section>
		<app-header />
		<div class="flex main-container gallery">
			<h1>Starred Boards</h1>
			<div class="board-list">
				<section v-for="board in starredBoards" :key="board._id">
					<span @click="getBoard(board._id)">
						<div
							:style="{ backgroundColor: board.styles.backgroundColor,backgroundImage: board.styles.backgroundGradient }"
							class="transition placeholder-preview"
						>
							<h4>{{ board.title }}</h4>
							<span class="flex icons">
								<i
									@click.prevent="removeBoard(board._id)"
									class="far fa-trash-alt transition"
								></i>
							</span>
						</div>
					</span>
				</section>
			</div>
			<h1>Your boards</h1>
			<div class="board-list">
				<div @click="createBoard" class="placeholder-preview add">
					<div class="vertical"><div class="horizontal"></div></div>
				</div>
				<section v-for="board in regularBoards" :key="board._id">
					<span @click="getBoard(board._id)">
						<div
							:style="{ backgroundColor: board.styles.backgroundColor }"
							class="transition placeholder-preview"
						>
							<h4>{{ board.title }}</h4>
							<span class="flex icons">
								<i
									@click.prevent="removeBoard(board._id)"
									class="far fa-trash-alt transition"
								></i>
							</span>
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
			const loggedUser = this.loggedInUser || { fullname: "Guest" };
			await this.$store.dispatch({
				type: "newBoard",
				loggedUser,
			});
			await this.loadBoards();
			await this.$store.dispatch({ type: "getBoard", boardId: this.boards[this.boards.length - 1]._id })
			this.$router.push('/board/' + this.boards[this.boards.length - 1]._id)
		},
		async removeBoard(boardId) {
			await this.$store.dispatch({
				type: "removeBoard",
				boardId,
			});
			await this.loadBoards();
		},
		async getBoard(boardId) {
			await this.$store.dispatch({ type: "getBoard", boardId: boardId })
			const board = this.$store.getters.currBoard
						this.$router.push('/board/' + board._id)
		}
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