<template>
  <section @mousedown.self="closeModal" class="task-details-modal">
    <div @click="togglePopUp(false)" class="task-details">
      <i class="fas fa-times details-close clickable" @click="closeModal"></i>
      <div class="cover" :style="coverToShow" v-if="currTask.cover.src"></div>
      <div class="task-details-main">
        <div class="details-header">
          <input
            v-model="taskCopy.title"
            @change="updateTask(taskCopy)"
            class="clean-input main-title"
          />
          <p class="sub-title">
            In list <span>{{ currGroup.title }}</span>
          </p>
        </div>
        <main class="details-body">
          <span v-if="currTask.dueDate"
            ><dueDateDetails
              @logActivity="saveActivity"
              :task="currTask"
              @updateTask="updateTask"
            ></dueDateDetails
          ></span>
          <section class="main-details">
            <div class="member-label-container">
              <div
                class="members-preview container"
                v-if="currTask.members.length"
              >
                <!-- <i class="fas fa-user"></i> -->
                <h1 class="uppercase-title">Members</h1>
                <section class="flex members-preview">
                  <span
                    class="flex avatar"
                    v-for="member in currTask.members"
                    :key="member._id"
                    @click="showProfile(member)"
                  >
                    <span @click="currMember = member"
                      ><avatar
                        :username="member.fullname"
                        :size="32"
                      ></avatar></span
                  ></span>
                  <memberProfile
                    v-if="showMemberProfile"
                    :currMember="currMember"
                    @closeProfile="hideProfile"
                  ></memberProfile>
                </section>
              </div>
              <div class="labels-preview flex" v-if="currTask.labelIds.length">
                <span class="uppercase-title">labels</span>
                <span class="flex">
                  <labels-preview
                    v-for="labelId in currTask.labelIds"
                    :key="labelId"
                    :labelId="labelId"
                    :currBoard="currBoard"
                  />
                </span>
              </div>
            </div>
            <task-description
              :task="currTask"
              @updateTask="updateTask"
              @changeMade="changeTaskDetails"
            />
            <attachments-preview
              v-if="currTask.imgs.length"
              @editImg="editImg"
              @removeImg="removeImg"
              :task="currTask"
              @logActivity="saveActivity"
            />
            <div v-if="currTask.checklists.length">
              <checklist
                v-for="checklist in currTask.checklists"
                :key="checklist.id"
                :checklist="checklist"
                :task="currTask"
                @updateTask="updateTask"
                @changeMade="changeTaskDetails"
                @removeChecklist="removeChecklist"
              />
            </div>
            <activityLog
              class="task-details-activity"
              :activities="getTaskActivity()"
            />
          </section>
          <div class="action-bar">
            <ul>
              <h3 class="uppercase-title">add to task</h3>
              <li
                v-for="(action, idx) in actions"
                :key="idx"
                @click.stop="togglePopUp(true, action)"
                class="action"
              >
                <i :class="action.iconClass"></i> {{ action.txt }}
              </li>
              <pop-up @closePopUp="togglePopUp" v-if="openPopUp">
                <template v-slot:header>{{ currAction.txt }}</template>
                <component
                  :is="currAction.type"
                  @updateBoard="updateBoard"
                  @updateTask="updateTask"
                  @changeMade="changeTaskDetails"
                  @logActivity="saveActivity"
                  @close="togglePopUp(false)"
                  :task="currTask"
                />
              </pop-up>
            </ul>
            <ul>
              <h3 class="uppercase-title">Actions</h3>
              <li class="action" @click="removeTask()">
                <i class="far fa-trash-alt"></i> Delete Task
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  </section>
</template>

<script>
import taskLabels from "@/cmps/task/edit-cmps/task-labels";
import taskMembers from "@/cmps/task/edit-cmps/member";
import checklistAdd from "@/cmps/task/edit-cmps/checklist-add";
import taskDueDate from "@/cmps/task/edit-cmps/due-date";
import taskAttachment from "@/cmps/task/edit-cmps/attachment-add";
import taskCover from "@/cmps/task/edit-cmps/cover-picker";
import activityLog from "@/cmps/recurring-cmps/activity-list";
import popUp from "@/cmps/task/pop-up";
import attachmentsPreview from "@/cmps/task-details/attachments-preview.vue";
import dueDateDetails from "@/cmps/task-details/due-date-details.vue";
import labelsPreview from "../cmps/task-details/labels-preview.vue";
import taskDescription from "../cmps/task-details/task-description.vue";
import checklist from "../cmps/task-details/checklist";
import Avatar from "vue-avatar";
import memberProfile from "../cmps/recurring-cmps/user-miniprofile.vue";

export default {
  data() {
    return {
      showMemberProfile: false,
      currMember: null,
      actions: [
        {
          txt: "Members",
          type: "taskMembers",
          iconClass: "far fa-user",
        },
        {
          txt: "Labels",
          type: "taskLabels",
          iconClass: "far fa-bookmark",
        },
        {
          txt: "Add checklist",
          type: "checklistAdd",
          iconClass: "fas fa-tasks",
        },
        {
          txt: "Due date",
          type: "taskDueDate",
          iconClass: "far fa-clock",
        },
        {
          txt: "Attachment",
          type: "taskAttachment",
          iconClass: "fas fa-paperclip",
        },
        {
          txt: "Cover",
          type: "taskCover",
          iconClass: "fas fa-square",
        },
      ],
      currAction: null,
      openPopUp: false,
      taskCopy: null,
    };
  },
  computed: {
    currBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
    },
    currTask() {
      return JSON.parse(JSON.stringify(this.$store.getters.currTask));
    },
    currGroup() {
      return this.$store.getters.currGroup;
    },
    taskId() {
      return this.$route.params.taskId;
    },
    coverToShow() {
      if (this.currTask.cover.isImg) return { backgroundImage: this.currTask.cover.src };
      else return { backgroundColor: this.currTask.cover.src };
    },
  },
  methods: {
    removeChecklist(idx) {
      const task = this.currTask;
      task.checklists.splice(idx, 1);
      this.updateTask(task);
    },
    saveActivity(activityTitle) {
      this.$store.dispatch({
        type: "saveActivity",
        activity: activityTitle,
        group: this.currGroup,
        board: this.currBoard,
        task: this.getTask(this.currBoard),
      });
      this.updateBoard(this.currBoard);
    },
    getTask(board, isIdx) {
      const group = board.groups.find(
        (group) => group.id === this.currGroup.id
      );
      let res;
      if (isIdx) res = group.task.findIndex((task) => task.id === this.taskId);
      else res = group.task.find((task) => task.id === this.taskId);
      return res;
    },
    async updateBoard(board) {
      await this.$store.dispatch({
        type: "saveBoardChanges",
        editedBoard: board,
      });
      this.$store.commit({ type: "setTask", taskId: this.taskId });
    },
    closeModal() {
      this.$router.push(`/board/${this.$route.params.boardId}`);
    },
    togglePopUp(boolean, actionType) {
      this.openPopUp = boolean;
      this.currAction = actionType;
    },
    removeTask() {
      const board = JSON.parse(JSON.stringify(this.currBoard));
      const taskIdx = this.getTask(board, true);
      const group = board.groups.find(
        (group) => group.id === this.currGroup.id
      );
      this.saveActivity(
        `removed the task "${group.task[taskIdx].title}" from "${group.title}"`
      );
      group.task.splice(taskIdx, 1);
      this.updateBoard(board);
      this.$router.push("../");
    },
    updateTask(task) {
      const updatedTask = JSON.parse(JSON.stringify(task));
      const board = this.currBoard;
      const group = board.groups.find(
        (group) => group.id === this.currGroup.id
      );
      const taskIdx = this.getTask(board, true);
      group.task.splice(taskIdx, 1, updatedTask);
      if (this.currTask.title !== updatedTask.title)
        this.saveActivity(
          `changed the task "${this.currTask.title}" to "${updatedTask.title}"`
        );
      this.updateBoard(board);
    },
    getTaskActivity() {
      const filteredActivities = this.currBoard.activities.filter(
        (activity) => {
          return activity.task.id === this.currTask.id;
        }
      );
      return filteredActivities;
    },
    changeTaskDetails(activityTitle) {
      this.saveActivity(activityTitle);
    },
    showProfile(member) {
      this.currMember = member;
      this.showMemberProfile = true;
    },
    hideProfile() {
      this.showMemberProfile = false;
    },
    editImg(imgToEdit) {
      const taskToEdit = JSON.parse(JSON.stringify(this.currTask));
      const foundIdx = taskToEdit.imgs.findIndex(
        (img) => img.id === imgToEdit.id
      );
      if (foundIdx < 0) return console.log("couldnt find idx");
      taskToEdit.imgs.splice(foundIdx, 1, imgToEdit);
      this.updateTask(taskToEdit);
    },
    removeImg(imgId) {
      const taskToEdit = JSON.parse(JSON.stringify(this.currTask));
      const foundIdx = taskToEdit.imgs.findIndex((img) => img.id === imgId);
      if (foundIdx < 0) return console.log("couldnt find idx");
      taskToEdit.imgs.splice(foundIdx, 1);
      this.updateTask(taskToEdit);
    },
  },
  created() {
    this.$store.commit({ type: "setTask", taskId: this.taskId });
    this.taskCopy = JSON.parse(JSON.stringify(this.currTask));
  },
  components: {
    popUp,
    taskLabels,
    labelsPreview,
    taskDescription,
    activityLog,
    taskMembers,
    checklistAdd,
    checklist,
    taskAttachment,
    taskDueDate,
    taskCover,
    Avatar,
    memberProfile,
    attachmentsPreview,
    dueDateDetails,
  },
};
</script>