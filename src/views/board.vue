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
		<div class="flex board">
			<div class="flex group-container">
				<draggable
					v-model="currBoard.groups"
					class="flex"
					animation="300"
					@end="draggingEnd"
					ghostClass="group-ghost"
					handle=".handle"
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
						@timeDueReminder="logTimeDue"
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
			this.updateBoard(board);
		},
		async removeGroup(groupId) {
			const board = this.currBoard;
			const groupIdx = board.groups.findIndex((group) => group.id === groupId);
			this.saveActivity(`removed the group "${board.groups[groupIdx].title}" from the board`, board, board.groups[groupIdx])
			board.groups.splice(groupIdx, 1);
			this.updateBoard(board);
		},
		addTask(task, groupId) {
			const board = this.currBoard;
			const group = board.groups.find((group) => group.id === groupId);
			group.task.push(task);
			this.saveActivity(`added the task "${task.title}" in "${group.title}"`, board, group, task)
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
			this.updateBoard(this.currBoard);

		},
		draggingEnd() {
			const board = this.currBoard;
			board.groups = this.currBoard.groups;
			this.updateBoard(board);
		},
		draggedTask(board) {
			this.updateBoard(board);
		},
		async changeTitle(newTitle, groupId) {
			//FIXME: cant get through async in this function. 'group' is supposed to save old group name and 'task' is supposed to save new 
			//but both of them get the name of the new group.
			const board = this.currBoard;
			const group = board.groups.find((group) => group.id === groupId);
			const groupCopy = JSON.parse(JSON.stringify(group))
			// await this.saveActivity('changed the title of the list',board,groupCopy,{title:newTitle})
			this.saveActivity(`renamed a group in the board`, board, groupCopy)
			group.title = newTitle;
			this.updateBoard(board);
		},
		async updateBoardTitle(newTitle) {
			const task = { newTitle: newTitle, oldTitle: this.currBoard.title }
			this.saveActivity('changed this board`s name', this.currBoard, {})
			this.currBoard.title = newTitle
			this.updateBoard(this.currBoard);
		},
		async logTimeDue(activityTitle, task) {
			//FIXME: decide if we even want this
			// const board = this.currBoard;
			// console.log('arrived',activityTitle,task.title);
			// await this.saveActivity(activityTitle, board,{id:'aaa',title:''},task)
		},
		toggleTaskCompleted(group,task) {
			const board = this.currBoard;
			const groupIdx = board.groups.findIndex((foundGroup) => group.id === foundGroup.id);
			board.groups.splice(groupIdx, 1,group);
			this.saveActivity(`marked the task "${task.title}" as completed`,board,group,task)
			this.updateBoard(board)
		}
	},
	async created() {
		await this.loadBoard();
	},
	components: {
		boardHeader,
		group,
		draggable,
		appHeader
	},
};
</script>