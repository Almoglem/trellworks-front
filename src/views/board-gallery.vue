<template>
	<section>
		<app-header />
		<div class="flex main-container gallery">
			<h1>Starred Boards</h1>
			<div class="board-list">
				<router-link
					class="board-preview"
					v-for="starBoard in starBoards"
					:key="starBoard._id"
					:to="'/board/' + starBoard._id"
				>
					<div class="placeholder-preview">
						<i
							style="float: right"
							@click.stop="removeBoard(board._id)"
							class="far fa-trash-alt transition"
						></i>
						<div class="transition preview-header">
							<h2>{{ starBoard.title }}</h2>
						</div>
					</div>
				</router-link>
			</div>
			<h1>Your boards</h1>
			<div class="board-list">
				<div @click="createBoard" class="placeholder-preview add">
					<div class="vertical"><div class="horizontal"></div></div>
				</div>
				<section v-for="board in allBoards" :key="board._id">
					<router-link :to="'/board/' + board._id">
						<div class="placeholder-preview">
							<div class="transition preview-header">
								<!-- <i style="float:right,z-index:3"  class="far fa-trash-alt transition"></i> -->
								<h2>{{ board.title }}</h2>
							</div>
						</div>
					</router-link>
					<button @click.self="removeBoard(board._id)">Delete</button>
				</section>
			</div>
		</div>
		<loader v-if="isLoading" />
	</section>
</template>

<script>
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import appHeader from '@/cmps/app-header'
import loader from '@/cmps/recurring-cmps/loader'
export default {
	data() {
		return {
			isLoading: false,
			starBoards: [],
			allBoards: []
		}
	},
	computed: {
		boards() {
			return this.$store.getters.boards
		},
		loggedInUser() {
			return this.$store.getters.loggedinUser
		}
	},
	methods: {
		async loadBoards() {
			try {
				this.isLoading = true;
				await this.$store.dispatch({
					type: 'loadBoards'
				})
				this.isLoading = false;
			} catch (err) {
				Swal.fire({
					position: 'bottom-end',
					title: 'Sorry, could not load boards.',
					showConfirmButton: false,
					timer: 1500,
					customClass: {
						title: 'error',
						popup: 'error'
					},
					toast: true,
					animation: true
				})
			}
		},
		async createBoard() {
			const loggedUser = this.loggedInUser || { fullname: 'Guest' }
			await this.$store.dispatch({
				type: 'newBoard',
				loggedUser
			})
			await this.loadBoards()
		},
		starredBoards() {
			return this.boards.filter(board => board.isStarred)
		},
		getBoards() {
			return this.boards.filter(board => !board.isStarred)
		}
		,
		async removeBoard(boardId) {
			await this.$store.dispatch({
				type: 'removeBoard',
				boardId
			})
			await this.loadBoards()
		}
	},
	async created() {
		await this.loadBoards()
		this.starBoards = this.starredBoards()
		this.allBoards = this.getBoards()
	},
	components: {
		appHeader,
		loader
	}


}
</script>