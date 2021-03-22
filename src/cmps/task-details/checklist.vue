<template>
	<section class="task-checklist">
		<div class="checklist-header flex">
			<div>
				<i class="fas fa-tasks fa-lg"></i>
				<h1 class="details-title">{{ checklist.title }}</h1>
			</div>
			<button class="btn-gray" @click="removeChecklist">Delete</button>
		</div>
		<div class="progress-container flex">
			<span>{{ completed }}</span>
			<div class="progress-bar">
				<div class="progress-done" ref="progress"></div>
			</div>
		</div>

		<div v-for="todo in checklist.todos" :key="todo.id">
			<todo-item
				:todo="todo"
				@updateTodo="updateTodo"
				@removeTodo="removeTodo"
			/>
		</div>

		<button v-if="!isAddingItem" class="btn-gray" @click="isAddingItem = true">
			Add an item
		</button>
		<form v-if="isAddingItem" @submit.prevent="addTodo">
			<input placeholder="Add an item" v-model="todoToAdd.title" />
			<button type="submit" class="btn-success">Add</button>
			<i
				class="fas fa-times clickable close-desc"
				@click="isAddingItem = false"
			>
			</i>
		</form>
	</section>
</template>


<script>
import { utilService } from "../../services/util.service";
import todoItem from "../task-details/todo-item";

export default {
	props: {
		checklist: Object,
		task: Object,
	},
	data() {
		return {
			isAddingItem: false,
			taskToEdit: null,
			checklistToEdit: null,
			todoToAdd: { title: "", isDone: false },
			completed: 0,
		};
	},
	computed: {
		checklistIdx() {
			return this.task.checklists.findIndex(
				(cl) => cl.id === this.checklist.id
			);
		},
	},
	methods: {
		/// updates
		updateTask() {
			this.taskToEdit.checklists.splice(
				this.checklistIdx,
				1,
				this.checklistToEdit
			);
			this.$emit("updateTask", this.taskToEdit);

			this.updateProgress();
		},
		updateProgress() {
			const todosLength = this.checklistToEdit.todos.length;
			const doneLength = this.checklistToEdit.todos.filter(
				(todo) => todo.isDone === true
			).length;
			if (!todosLength) this.completed = "0%";
			else this.completed = Math.round((doneLength / todosLength) * 100) + "%";
		    //FIXME: this log occures every time one enters the task details...
			// if (this.completed !== "0%") this.$emit('logActivity', `has completed ${this.completed} of the checklist "${this.checklist.title}" in "${this.taskToEdit.title}"`)
			this.$refs.progress.style.width = this.completed;
			this.$refs.progress.style.background =
				doneLength / todosLength === 1 ? "#64916a" : "#0079bf";

		},
		/// actions
		removeChecklist() {
			this.$emit('logActivity', `removed a checklist in "${this.taskToEdit.title}"`)
			this.$emit("removeChecklist", this.checklistIdx);

		},
		/// actions coming from todo emits
		addTodo() {
			this.isAddingItem = false;
			this.todoToAdd.id = utilService.makeId();
			this.checklistToEdit.todos.push(this.todoToAdd);
			this.updateTask();
			this.todoToAdd = { title: "", isDone: false };
			this.$emit('logActivity', `added items in the checklist "${this.checklist.title}" in "${this.taskToEdit.title}"`)

		},
		removeTodo(todoId) {
			const idx = this.getTodoIdx(todoId);
			this.checklistToEdit.todos.splice(idx, 1);
			this.$emit('logActivity', `removed items from the checklist "${this.checklist.title}" in "${this.taskToEdit.title}"`)

			this.updateTask();
		},
		updateTodo(updatedTodo) {
			const idx = this.getTodoIdx(updatedTodo.id);
			this.checklistToEdit.todos.splice(idx, 1, updatedTodo);
			this.updateTask();
		},
		/// helpers
		getTodoIdx(todoId) {
			return this.checklistToEdit.todos.findIndex((todo) => todo.id === todoId);
		},
		getChecklistIdx() { },
	},
	created() {
		this.taskToEdit = JSON.parse(JSON.stringify(this.task));
		this.checklistToEdit = JSON.parse(JSON.stringify(this.checklist));
	},
	mounted() {
		this.updateProgress();
	},
	components: { todoItem },
};
</script>
