<template>
  <section>
    <div
      class="pop-up-window"
      v-if="openPopUp"
      @click="openPopUp = false"
    ></div>
    <div class="group handle flex column" v-if="group">
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
        <p @click="toggleEditter" class="clean-input group-title" v-else>
          {{ group.title }}
        </p>
        <span @click.stop="togglePopUp(true, $event)" class="group-header-trash"
          ><i class="fas fa-ellipsis-h"></i>
        </span>
      </section>
      <draggable
        class="tasks-container"
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
          @taskEdited="taskEdited"
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
      <div
        class="add-task-container"
        ref="addTaskContainer"
        v-if="isAddingTask"
      >
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
          <button class="btn-success" @click="addTask(group.id)">
            Add task
          </button>
          <i class="fas fa-times clickable" @click="closeAddTask"> </i>
        </div>
      </div>
    </div>
    <popUp
      class="quickmenu-popup"
      :style="setCurrPos"
      @closePopUp="togglePopUp(false)"
      v-if="openPopUp"
    >
      <template v-slot:header>
        <span
          v-if="sortVisible"
          @click="sortVisible = false"
          class="clickable bold backwords-arrow"
        >
          ❮
        </span>
        Options</template
      >
      <section v-if="sortVisible">
        <p class="clickable" @click="sortGroup('alphabetically')">
          Alphabetically
        </p>
        <p class="clickable" @click="sortGroup('timeNewest')">Newest First</p>
        <p class="clickable" @click="sortGroup('timeOldest')">Oldest First</p>
      </section>
      <section v-else>
        <span class="flex menu-item transition clickable">
          <i class="fas fa-pencil-alt"></i>
          <p @click="toggleEditter">Edit Title</p>
        </span>
        <span
          v-if="group.task.length > 1"
          class="flex menu-item transition clickable"
          @click="sortVisible = true"
          ><i class="fas fa-sort"></i>
          <p>Sort</p></span
        >
        <span class="flex menu-item transition clickable">
          <i class="fas fa-plus"></i>
          <p @click="openAddTask">Add Task</p>
        </span>
        <span
          class="flex menu-item transition clickable"
          @click="removeGroup(group.id)"
          ><i class="far fa-trash-alt"></i>
          <p>Delete List</p></span
        >
      </section>
    </popUp>
  </section>
</template>

<script>
import taskPreview from "@/cmps/task/task-preview";
import { boardService } from "../../services/board.service";
import draggable from "vuedraggable";
import popUp from "@/cmps/task/pop-up";

export default {
  props: {
    group: {
      type: Object,
    },
    board: {
      type: Object,
    },
    menuToggler: Boolean,
  },
  data() {
    return {
      isAddingTask: false,
      taskToAdd: boardService.getEmptyTask(),
      titleToEdit: false,
      toggleTitleEdit: false,
      openPopUp: false,
      sortVisible: null,
      setPos: { x: 0, y: 0 },
      currClientWidth: 0,
      popUpWidth: 170,
    };
  },
  computed: {
    setCurrPos() {
      return {
        left: this.setPos.x + "px",
        top: this.setPos.y + "px",
        width: 170 + "px",
      };
    },
  },
  methods: {
    removeGroup(groupId) {
      this.$emit("removeGroup", groupId);
    },
    titleChangeByKey(groupId, ev) {
      if (ev.keyCode === 13) {
        this.$emit("titleChange", this.group.title, groupId);
        ev.target.blur();
      } else return;
    },
    titleChange(groupId) {
      this.$emit("titleChange", this.group.title, groupId);
    },
    openAddTask() {
      this.openPopUp = false;
      this.isAddingTask = true;
      setTimeout(() => {
        this.$refs.textarea.$el.focus();
      }, 0);
    },
    closeAddTask() {
      this.isAddingTask = false;
      this.taskToAdd.title = "";
    },
    async addTask(groupId) {
      if (!this.taskToAdd.title) return;
      this.$emit("addTask", this.taskToAdd, groupId);
      this.taskToAdd = boardService.getEmptyTask();
      this.isAddingTask = true;
      this.$refs.textarea.$el.focus();
    },
    async addTaskByKey(ev, groupId) {
      if (his.taskToAdd.title.length <= 1) return;
      if (ev.keyCode === 13) {
        this.taskToAdd.title = this.taskToAdd.title.slice(
          0,
          this.taskToAdd.title.length - 1
        );
        this.$emit("addTask", this.taskToAdd, groupId);
        this.taskToAdd = boardService.getEmptyTask();
        this.isAddingTask = true;
        this.$refs.textarea.$el.focus();
      }
    },
    itemsDragged() {
      this.$emit("taskDragged", this.board);
    },
    taskEdited(task) {
      const group = JSON.parse(JSON.stringify(this.group));
      const taskIdx = group.task.findIndex(
        (groupTask) => groupTask.id === task.id
      );
      group.task.splice(taskIdx, 1, task);
      this.$emit("taskEdited", group, task);
    },
    updatedDueDate(task) {
      const group = JSON.parse(JSON.stringify(this.group));
      const taskIdx = group.task.findIndex(
        (groupTask) => groupTask.id === task.id
      );
      group.task.splice(taskIdx, 1, task);
      this.$emit("toggleTaskCompletion", group, task);
    },
    updateGroupTitle(ev) {
      this.group.title = ev.target.innerText;
    },
    toggleEditter() {
      this.openPopUp = false;
      this.toggleTitleEdit = true;
      setTimeout(() => {
        this.$refs.editTitle.$el.focus();
      }, 0);
    },
    togglePopUp(isOpened, ev) {
      this.openPopUp = isOpened;
      this.$emit("setToggler", isOpened);
      if (isOpened) {
        this.calcPos(ev);
      }
    },
    calcPos(ev) {
      if (this.currClientWidth !== ev.view.innerWidth) {
        this.setPos.x = ev.pageX;
      }
      this.setPos.y = ev.pageY;
      this.setPos.y += 113;
      this.setPos.x = ev.pageX;
      this.setPos.x += 100;
      this.currClientWidth = ev.view.innerWidth;
      if (this.currClientWidth - this.setPos.x < this.popUpWidth)
        this.setPos.x -= 170;
    },
    sortGroup(sortBy) {
      let groupCopy = JSON.parse(JSON.stringify(this.group));
      let tasksCopy = groupCopy.task;
      if (sortBy === "timeOldest")
        tasksCopy = tasksCopy.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
      else if (sortBy === "timeNewest")
        tasksCopy = tasksCopy.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      else if (sortBy === "alphabetically")
        tasksCopy = tasksCopy.sort((a, b) => {
          var nameA = a.title.toUpperCase();
          var nameB = b.title.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      this.$emit("sortGroup", groupCopy);
    },
    toggleMenu(isShown, ev) {
      this.$emit("setToggler", true);
      if (isShown) {
        this.calcPos(ev);
      }
    },
  },
  components: {
    taskPreview,
    draggable,
    popUp,
  },
};
</script>