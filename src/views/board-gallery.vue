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
							<i style="float:right" @click="deleteBoard(board._id)" class="far fa-trash-alt transition"></i>
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
				<router-link
					class="board-preview"
					v-for="board in boards"
					:key="board._id"
					:to="'/board/' + board._id"
				>
					<div class="placeholder-preview">
							<i style="float:right" @click="deleteBoard(board._id)" class="far fa-trash-alt transition"></i>
						<div class="transition preview-header">
							<h2>{{ board.title }}</h2>
						</div>
					</div>
				</router-link>
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
			starBoards: []
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
			this.loadBoards()
		},
		starredBoards() {
			return this.boards.filter(board => board.isStarred)
		}
	},
	async created() {
		await this.loadBoards()
		this.starBoards = this.starredBoards()
	},
	components: {
		appHeader,
		loader
	}


}
</script>