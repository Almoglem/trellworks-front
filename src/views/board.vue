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
		/>
		<div class="flex board"  >
			<div class="flex group-container" >
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
		<router-view />
	</section>
</template>

<script>
import appHeader from '@/cmps/app-header'
import boardHeader from "@/cmps/board/board-header";
import group from "@/cmps/board/group";
import draggable from "vuedraggable";
import { boardService } from "../services/board.service.js";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import {socketService} from '@/services/socket.service'

export default {
	computed: {
		boardId() {
			return this.$route.params.boardId;
		},
		currBoard() {
			return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
		},
	},
	methods: {
		async updateBoard(board) {
			await this.$store.dispatch({
				type: "saveBoardChanges",
				editedBoard: board,
			});
		},
		async loadBoard() {
			await this.$store.dispatch({
				type: "getBoard",
				boardId: this.boardId,
			});
		},
		async addGroup() {
			const board = this.currBoard;
			const group = await boardService.getEmptyGroup();
			board.groups.push(group);
			this.saveActivity(`added the group "${group.title}" to the board`, board, group)
			socketService.emit('board update', board)
			this.updateBoard(board);
		},
		async removeGroup(groupId) {
			const board = this.currBoard;
			const groupIdx = board.groups.findIndex((group) => group.id === groupId);
			this.saveActivity(`removed the group "${board.groups[groupIdx].title}" from the board`, board, board.groups[groupIdx])
			board.groups.splice(groupIdx, 1);
			socketService.emit('board update', board)
			this.updateBoard(board);
					Swal.fire({
			position: 'bottom-end',
			title: 'Removed successfully',
			showConfirmButton: false,
			timer: 1500,
			background:'#c6c8cc',
			toast:true,
			animation:true
		})
		},
		addTask(task, groupId) {
			const board = this.currBoard;
			const group = board.groups.find((group) => group.id === groupId);
			group.task.push(task);
			this.saveActivity(`added the task "${task.title}" in "${group.title}"`, board, group, task)
			socketService.emit('board update', board)
			this.updateBoard(board);
		},
		saveActivity(activityTitle, board, group, task = { id: '', title: '' }) {
			this.$store.dispatch({
				type: "saveActivity",
				activity: activityTitle,
				group: group,
				board: board,
				task: task
			});
		},
		bgcChanged() {
			this.saveActivity('changed this board`s background color', this.currBoard, {})
			socketService.emit('board update', board)
			this.updateBoard(this.currBoard);
		},
		draggingEnd() {
			const board = this.currBoard;
			board.groups = this.currBoard.groups;
			socketService.emit('board update', board)
			this.updateBoard(board);
		},
		draggedTask(board) {
			socketService.emit('board update', board)
			this.updateBoard(board);
		},
		async changeTitle(newTitle, groupId) {
			const board = this.currBoard;
			const group = board.groups.find((group) => group.id === groupId);
			const groupCopy = JSON.parse(JSON.stringify(group))
			this.saveActivity(`renamed a group in the board`, board, groupCopy)
			group.title = newTitle;
			socketService.emit('board update', board)
			this.updateBoard(board);
		},
		async updateBoardTitle(newTitle) {
			this.saveActivity('changed this board`s name', this.currBoard, {})
			this.currBoard.title = newTitle
			socketService.emit('board update', board)
			this.updateBoard(this.currBoard);
		},
		toggleTaskCompleted(group, task) {
			const board = this.currBoard;
			const groupIdx = board.groups.findIndex((foundGroup) => group.id === foundGroup.id);
			board.groups.splice(groupIdx, 1, group);
			this.saveActivity(`marked the task "${task.title}" as completed`, board, group, task)
			socketService.emit('board update', board)
			this.updateBoard(board)
		},
	},
	async created() {
		await this.loadBoard();
		socketService.setup()
		socketService.on('board updated', board => {
			this.updateBoard(board)
		})
	},
	components: {
		boardHeader,
		group,
		draggable,
		appHeader
	},
};
</script>