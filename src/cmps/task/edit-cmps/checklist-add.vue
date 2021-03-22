<template>
  <section class="task-checklist">
    <h3 class="pop-up-title">Title</h3>
    <form @submit.prevent="addChecklist()">
      <input v-model="checklist.title" />
      <button type="submit" class="btn-gray">Add</button>
    </form>
  </section>
</template>


<script>
import { utilService } from "../../../services/util.service";
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      taskToEdit: JSON.parse(JSON.stringify(this.task)),
      checklist: {
        title: "",
        todos: [],
      },
    };
  },
  methods: {
    addChecklist() {
      this.checklist.id = utilService.makeId();
      this.taskToEdit.checklists.push(this.checklist);
      // this.$emit("changeMade", `added the checklist ${this.checklist.title}`);
      this.$emit("updateTask", this.taskToEdit);
      this.$emit('logActivity',`added a checklist in "${this.taskToEdit.title}"`)
      this.$emit("close");
      this.checklist = { title: "", todos: [] };
    },
  },
};
</script>
