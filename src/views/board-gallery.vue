<template>
	<section>
		<app-header/>
		<div class="flex main-container gallery">
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
						<div class="transition preview-header">
							<h2>{{ board.title }}</h2>
						</div>
					</div>
				</router-link>
			</div>
		</div>
	</section>
</template>

<script>
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import appHeader from '@/cmps/app-header'
export default {
	data() {
		return {}
	},
	computed: {
		boards() {
			//FIXME: no need to return whole board array with tasks inside. mini-boards array with titles and ids is enough
			return this.$store.getters.boards
		}
	},
	methods: {
		async loadBoards() {
			try {
				await this.$store.dispatch({
				type: 'loadBoards'
			})
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
					toast:true,
					animation:true
			})
			}
		},
		async createBoard() {
			await this.$store.dispatch({
				type: 'newBoard'
			})
			this.loadBoards()
		},
	},
	async created() {
		await this.loadBoards()
	},
	components: {
		appHeader
	}


}
</script>