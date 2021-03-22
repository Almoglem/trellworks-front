  <template>
  <div class="description">
    <i class="fas fa-align-left fa-lg"></i>
    <h1 class="details-title">Description</h1>
    <button
      v-if="!isEditing && taskToEdit.description"
      @click="openEdit()"
      class="btn-gray"
    >
      Edit
    </button>
    <div
      v-if="!isEditing && !taskToEdit.description"
      @click="openEdit()"
      class="description-input clickable"
    >
      Add a more detailed description...
    </div>
    <div v-if="isEditing" class="description-edit">
      <form @submit.prevent="setDescription">
        <textarea
          v-model="taskToEdit.description"
          ref="descriptionEdit"
          autofocus
          class="description-input clean-input"
          placeholder="Add a more detailed description..."
        ></textarea>
        <div>
          <button type="submit" class="btn-success">Save</button>
          <i
            class="fas fa-times clickable close-desc"
            @click="isEditing = false"
          >
          </i>
        </div>
      </form>
    </div>
    <p v-else>{{ taskToEdit.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      isEditing: false,
      taskToEdit: JSON.parse(JSON.stringify(this.task)),
    };
  },
  methods: {
    openEdit() {
      this.isEditing = true;
      setTimeout(() => {
        this.$refs.descriptionEdit.focus();
      }, 0);
    },
    setDescription() {
      this.$emit("changeMade", `changed the description of "${this.task.title}"`);
      this.$emit("updateTask", this.taskToEdit);
      this.isEditing = false;
    },
  },
};
</script>
  
  