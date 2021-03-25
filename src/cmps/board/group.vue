<template>
		<div class="group handle" v-if="group">
			<section class="flex group-header transition"> 
					<textarea-autosize
					v-if="toggleTitleEdit"
					class="clean-input group-title"
					v-model="group.title"
					rows="1"
					:max-height="350"
					ref="editTitle"
					spellcheck="false"
					@focusout.native="titleChange(group.id)"
					@keypress.native="titleChangeByKey(group.id, $event)"
					/>
					<p @click="toggleEditter" class="clean-input group-title" v-else>{{group.title}}</p>
				<span @click="removeGroup(group.id)" class="group-header-trash"
					><i class="far fa-trash-alt transition"></i>
				</span>
			</section>
			<draggable
				@end="itemsDragged"
				group="task"
				animation="400"
				ghostClass="task-ghost"
				v-model="group.task"
			>
				<task-preview
					v-for="task in group.task"
					:key="task.id"
					:task="task"
					:groupId="group.id"
					@updateDueDate="updatedDueDate"
				/>
			</draggable>
			<span
				v-if="!isAddingTask"
				@click="openAddTask(group.id)"
				class="open-task-composer clickable"
			>
				<i class="fas fa-plus"></i>
				Add another task</span
			>
			<div class="add-task-container" v-if="isAddingTask">
				<textarea-autosize
					@keyup.native="addTaskByKey($event, group.id)"
					ref="textarea"
					placeholder="Your task title here..."
					rows="2"
					cols="29"
					class="task-preview add-task"
					v-model="taskToAdd.title"
					spellcheck="false"				
				/>
				<div class="add-task-footer">
					<button class="btn-success" @click="addTask(group.id)">Add task</button>
					<i class="fas fa-times clickable" @click="closeAddTask"> </i>
				</div>
			</div>
		</div>

</template>

<script>
import taskPreview from "@/cmps/task/task-preview";
import { boardService } from "../../services/board.service";
import draggable from "vuedraggable";

export default {
	props: {
		group: {
			type: Object,
		},
		board: {
			type: Object,
		},
	},
	data() {
		return {
			isAddingTask: false,
			taskToAdd: boardService.getEmptyTask(),
			titleToEdit: false,
			toggleTitleEdit: false
		};
	},
	methods: {
		removeGroup(groupId) {
			this.$emit("removeGroup", groupId);
		},
		titleChangeByKey(groupId, ev) {
			if(ev.keyCode === 13) {
				this.$emit("titleChange", this.group.title, groupId);
				ev.target.blur()
			} else return
		},
		titleChange(groupId){
			this.$emit("titleChange", this.group.title, groupId);			
		},
		openAddTask() {
			this.isAddingTask = true;
			setTimeout(() => {
				this.$refs.textarea.$el.focus()
			}, 0)
		},
		closeAddTask() {
			this.isAddingTask = false;
			this.taskToAdd.title = ''
		},
		async addTask(groupId) {
			if (!this.taskToAdd.title) return;
			this.$emit("addTask", this.taskToAdd, groupId);
			this.taskToAdd = boardService.getEmptyTask();
			this.isAddingTask = true;
			this.$refs.textarea.$el.focus()
		},
		async addTaskByKey(ev, groupId){
			if(ev.keyCode === 13 && this.taskToAdd.title.length <= 1) return
			if(ev.keyCode === 13){
				this.$emit("addTask", this.taskToAdd, groupId);
				this.taskToAdd = boardService.getEmptyTask();
				this.isAddingTask = true;
				this.$refs.textarea.$el.focus()
			}
		},
		itemsDragged() {
			this.$emit("taskDragged", this.board);
		},
		updatedDueDate(task) {
			const group = JSON.parse(JSON.stringify(this.group));
			const taskIdx = group.task.findIndex(groupTask => groupTask.id === task.id)
			group.task.splice(taskIdx, 1, task)
			this.$emit('toggleTaskCompletion', group,task)
		},
		updateGroupTitle(ev){
			this.group.title = ev.target.innerText
		},
		toggleEditter(){
			this.toggleTitleEdit = true;
			setTimeout(() => {
				this.$refs.editTitle.$el.focus()				
			}, 0);
		}
	},
	components: {
		taskPreview,
		draggable,
	},
	created(){

	}
};
</script>