<template>
  <section
    @contextmenu.prevent="showEdit = true"
    @click="getDetails"
    class="task-preview clickable"
    :style="bgcToShow"
    :class="setCoverImgFull"
  >
    <div class="top-cover" v-if="task.cover.src && typeTop">
      <div
        class="cover-color"
        v-if="!task.cover.isImg"
        :style="{ backgroundColor: task.cover.src }"
      ></div>
      <div class="cover-img" v-if="task.cover.isImg">
        <img :src="task.cover.src" />
      </div>
    </div>

    <div class="task-preview-main" :class="setCoverFullTitle">
      <div
        class="task-preview-labels"
        v-if="task.labelIds.length && currBoard && typeTop"
      >
        <labels-preview
          v-for="labelId in task.labelIds"
          :key="labelId"
          :labelId="labelId"
          :fromPreview="true"
        />
      </div>
      <p class="task-preview-title" :style="typeFullFont">{{ task.title }}</p>
      <div
        class="preview-footer-container flex"
        v-if="typeTop && footerIsShown"
      >
        <div class="left">
          <dueDatePreview
            :style="{marginRight: '8px'}"
            v-if="task.dueDate"
            :task="task"
            @dueDateUpdated="updateDueDate"
          />
          <i v-if="task.description" :style="{marginRight: '8px'}" class="fas fa-align-left fa-sm desc-preview"></i>
          <span class="flex" v-if="task.imgs.length">
            <i class="far fa-file-image"></i>  <span style="font-size:12px"> {{task.imgs.length}}</span>
          </span>
          <span
            class="checklist-preview"
            :class="{ 'checklist-success': areTodosCompleted }"
            v-if="task.checklists.length"
          >
            <i v-if="task.checklists.length" class="far fa-check-square"></i>
            {{ getChecklistString }}
          </span>

        </div>
        <div class="right">
          <span class="flex preview-avatar-container">
            <span class="avatar" v-for="member in task.members" :key="member.id">
             <userPic :user="member" :size="20" />
              
            </span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import labelsPreview from "../task-details/labels-preview.vue";
import Avatar from "vue-avatar";
import dueDatePreview from "@/cmps/task/due-date-preview.vue";
import userPic from "@/cmps/recurring-cmps/user-pic.vue";


export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showEdit: false,
      areTodosCompleted: false,
    };
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    bgcToShow() {
      if (
        this.task.cover.src &&
        this.task.cover.type === "full" &&
        this.task.cover.isImg
      )
        return { backgroundImage: `url(${this.task.cover.src})` };
      else if (
        this.task.cover.src &&
        this.task.cover.type === "full" &&
        !this.task.cover.isImg
      )
        return { backgroundColor: this.task.cover.src };
      else return { backgroundColor: "#fff" };
    },
    setCoverImgFull() {
      return {
        "cover-img-full":
          this.task.cover.isImg && this.task.cover.type === "full",
      };
    },
    setCoverFullTitle() {
      return {
        "cover-txt-full": this.task.cover.type === "full",
        "full-height":
          !this.task.cover.isImg && this.task.cover.type === "full",
      };
    },
    typeTop() {
      return this.task.cover.type === "top" ? true : false;
    },
    typeFullFont() {
      if (this.task.cover.type === "full" && this.task.cover.src === "#344563")
        return { fontSize: "16px", fontWeight: 700, color: "#fff" };
      if (this.task.cover.type === "full")
        return { fontSize: "16px", fontWeight: 700 };
    },
    footerIsShown() {
      if (
        this.task.dueDate ||
        this.task.description ||
        this.task.members.length ||
        this.task.checklists.length||
        this.task.imgs.length
      )
        return true;
      else return false;
    },
    getChecklistString() {
      if (!this.task.checklists) {
        this.areTodosCompleted = false;
        return;
      }
      let allTodos = 0;
      let doneTodos = 0;
      this.task.checklists.forEach((checklist) => {
        if (checklist.todos) {
          checklist.todos.forEach((todo) => {
            if (todo.isDone) doneTodos++;
          });
          allTodos += checklist.todos.length;
        }
      });
      if (!allTodos) return;
      if (doneTodos === allTodos && allTodos > 0) this.areTodosCompleted = true;
      else if (doneTodos !== allTodos && allTodos > 0)
        this.areTodosCompleted = false;
      return `${doneTodos}/${allTodos}`;
    },
  },
  methods: {
    getDetails() {
      const currBoard = JSON.parse(
        JSON.stringify(this.$store.getters.currBoard)
      );
      this.$store.commit({ type: "setGroup", groupId: this.groupId });
      this.$store.commit({ type: "setTask", task: this.task });
      this.$router.push(`/board/${currBoard._id}/details/${this.task.id}`);
    },
    toggleEdit(boolean) {
      this.showEdit = boolean;
    },
    updateDueDate(task) {
      this.$emit("updateDueDate", task);
    },
    taskEdited(task){
this.$emit("taskEdited",task)
      }
  },
  created() {},
  components: {
    labelsPreview,
    Avatar,
    dueDatePreview,
    userPic
  },
  
};
</script>

    