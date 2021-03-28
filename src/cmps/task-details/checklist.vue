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
      <span>{{ checklist.completed }}</span>
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

    <button v-if="!isAddingItem" class="btn-gray" @click="addTodoInput">
      Add an item
    </button>
    <form v-if="isAddingItem" @submit.prevent="addTodo">
      <input
        placeholder="Add an item"
        ref="taskadd"
        v-model="todoToAdd.title"
      />
      <button type="submit" class="btn-success">Add</button>
      <i class="fas fa-times clickable close-desc" @click="closeTodoInput"> </i>
    </form>
  </section>
</template>


<script>
import { utilService } from "../../services/util.service";
import todoItem from "../task-details/todo-item";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

export default {
  props: {
    checklist: Object,
    task: Object,
  },
  data() {
    return {
      isAddingItem: false,
      taskToEdit: JSON.parse(JSON.stringify(this.task)),
      todoToAdd: { title: "", isDone: false },
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
      this.taskToEdit.checklists.splice(this.checklistIdx, 1, this.checklist);
      this.updateProgress();
      if (this.checklist.completed !== "0%") {
        this.$emit(
          "logActivity",
          `has completed ${this.checklist.completed} of the checklist "${this.checklist.title}" in "${this.taskToEdit.title}"`
        );
      }
      if (this.checklist.completed === "100%") {
        Swal.fire({
          position: "bottom-end",
          title: "You have finished all of your to-do list!",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "success",
            popup: "success",
          },
          toast: true,
          animation: true,
        });
      }
      this.$emit("updateTask", this.taskToEdit);
    },
    updateProgress() {
      const todosLength = this.checklist.todos.length;
      const doneLength = this.checklist.todos.filter(
        (todo) => todo.isDone === true
      ).length;
      if (!todosLength) this.checklist.completed = "0%";
      else
        this.checklist.completed =
          Math.round((doneLength / todosLength) * 100) + "%";
      this.$refs.progress.style.width = this.checklist.completed;
      this.$refs.progress.style.background =
        doneLength / todosLength === 1 ? "#64916a" : "#0079bf";
    },
    /// actions
    removeChecklist() {
      this.$emit("removeChecklist", this.checklistIdx);
      this.$emit(
        "logActivity",
        `removed a checklist in "${this.taskToEdit.title}"`
      );
    },
    addTodoInput() {
      this.isAddingItem = true;
      setTimeout(() => {
        this.$refs.taskadd.focus();
      }, 0);
    },
    closeTodoInput() {
      this.isAddingItem = false;
      this.todoToAdd.title = "";
    },
    addTodo() {
      if (!this.todoToAdd.title) return;
      this.isAddingItem = false;
      this.todoToAdd.id = utilService.makeId();
      this.checklist.todos.push(this.todoToAdd);
      this.$emit(
        "logActivity",
        `added item "${this.todoToAdd.title}" in the checklist "${this.checklist.title}"`
      );
      this.updateTask();
      this.todoToAdd = { title: "", isDone: false };
      this.isAddingItem = true;
      this.$refs.taskadd.focus();
    },
    /// actions coming from todo emits
    removeTodo(todoId) {
      const idx = this.getTodoIdx(todoId);
      this.checklist.todos.splice(idx, 1);
      this.$emit(
        "logActivity",
        `removed items from the checklist "${this.checklist.title}" in "${this.taskToEdit.title}"`
      );
      this.updateTask();
    },
    updateTodo(updatedTodo) {
      const idx = this.getTodoIdx(updatedTodo.id);
      this.checklist.todos.splice(idx, 1, updatedTodo);
      this.updateTask();
    },
    /// helpers
    getTodoIdx(todoId) {
      return this.checklist.todos.findIndex((todo) => todo.id === todoId);
    },
    getChecklistIdx() {},
  },
  mounted() {
    this.updateProgress();
  },
  watch: {
    checklist() {
      this.updateProgress();
    },
  },
  components: { todoItem },
};
</script>
