<template>
  <section class="todo-item flex">
    <div>
      <i
        :class="isDoneClass('checkbox')"
        class="clickable"
        @click="toggleDone"
      ></i>
      <span :class="isDoneClass('title')"> {{ todo.title }} </span>
    </div>
    <i class="fas fa-trash-alt clickable" @click="removeTodo"></i>
  </section>
</template>


<script>
export default {
  name: "todo-item",
  props: {
    todo: Object,
  },
  data() {
    return {
      todoToEdit: JSON.parse(JSON.stringify(this.todo)),
    };
  },
  computed: {
    // isDoneClass(element) {
    //   if (element === "checkbox")
    //     return this.todo.isDone ? "far fa-check-square" : "far fa-square";
    //   if (element === "title") return this.todo.isDone ? "line-through" : "";
    // },
  },
  methods: {
    toggleDone() {
      this.todoToEdit.isDone = !this.todoToEdit.isDone;
      this.$emit("updateTodo", this.todoToEdit);
    },
    removeTodo() {
      this.$emit("removeTodo", this.todoToEdit.id);
    },
    isDoneClass(element) {
      if (element === "checkbox")
        return this.todo.isDone ? "far fa-check-square" : "far fa-square";
      if (element === "title") return this.todo.isDone ? "line-through" : "";
    },
  },
};
</script>
