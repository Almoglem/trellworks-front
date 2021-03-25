<template>
  <section @mousedown.self="closeModal" class="task-details-modal">
    <div @click="togglePopUp(false)" class="task-details">
      <i
        class="fas fa-times details-close clickable"
        :class="closeBtn"
        @click="closeModal"
      ></i>
      <div
        class="cover"
        :style="{ backgroundColor: currTask.cover.src }"
        v-if="currTask.cover.src && !currTask.cover.isImg"
      ></div>
      <div
        class="cover-image"
        v-if="currTask.cover.src && currTask.cover.isImg"
      >
        <img :src="currTask.cover.src" />
      </div>
      <div class="task-details-main">
        <div class="details-header">
          <textarea-autosize
            spellcheck="false"
            v-model="taskCopy.title"
            rows="1"
            ref="taskTitle"
            @keypress.native="updateTaskByKey($event, taskCopy)"
            @change.native="updateTask(taskCopy)"
            class="clean-input main-title"
          />
          <p class="sub-title">
            In list <span>{{ currGroup.title }}</span>
            <span>HIIII</span>
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
              @logActivity="saveActivity"
            />
            <attachments-preview
              v-if="currTask.imgs.length"
              @editImg="editImg"
              @removeImg="removeImg"
              @setCover="setCoverImg"
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
                @removeChecklist="removeChecklist"
                @logActivity="saveActivity"
              />
            </div>
            <i class="far fa-comment"></i>
            <h1 class="details-title">Post a Comment</h1>
            <comments @postComment="logComment" />
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
                @click.stop="togglePopUp(true, action, $event)"
                class="action transition"
              >
                <i :class="action.iconClass"></i>
                <span class="action-txt"> {{ action.txt }}</span>
              </li>
              <pop-up
                @closePopUp="togglePopUp"
                :style="setCurrPos"
                v-if="openPopUp"
              >
                <template v-slot:header>{{ currAction.txt }}</template>
                <component
                  :is="currAction.type"
                  @updateBoard="updateBoard"
                  @updateTask="updateTask"
                  @logActivity="saveActivity"
                  @close="togglePopUp(false)"
                  :task="currTask"
                  @toggleLoader="toggleLoader"
                />
              </pop-up>
            </ul>
            <ul>
              <h3 class="uppercase-title">Actions</h3>
              <li class="action" @click="removeTask()">
                <i class="far fa-trash-alt"></i>
                <span class="action-txt"> Delete Task</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
    <loader v-if="isLoading" />
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
import comments from "@/cmps/task-details/comments.vue";
import dueDateDetails from "@/cmps/task-details/due-date-details.vue";
import labelsPreview from "../cmps/task-details/labels-preview.vue";
import taskDescription from "../cmps/task-details/task-description.vue";
import checklist from "../cmps/task-details/checklist";
import Avatar from "vue-avatar";
import memberProfile from "../cmps/recurring-cmps/user-miniprofile.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { socketService } from "@/services/socket.service";
import { utilService } from "@/services/util.service";
import loader from "@/cmps/recurring-cmps/loader";

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
      isLoading: false,
      setPos: { x: 0, y: 0 },
      currClientWidth: 0,
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
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    closeBtn() {
      return { "close-btn-details": this.currTask.cover.src };
    },
    setCurrPos() {
      return { left: this.setPos.x + "px", top: this.setPos.y + "px" };
    },
  },
  methods: {
    removeChecklist(idx) {
      const task = this.currTask;
      task.checklists.splice(idx, 1);
      this.updateTask(task);
    },
    async saveActivity(activityTitle, isComment = false) {
      try {
        const activityTask = JSON.parse(JSON.stringify(this.currTask));
        const board = this.currBoard;
        board.activities.unshift({
          byMember: this.loggedInUser || { fullname: "Guest" },
          title: activityTitle,
          createdAt: Date.now(),
          group: {
            id: this.currGroup.id,
            title: this.currGroup.title,
          },
          id: utilService.makeId(),
          task: {
            id: activityTask.id,
            title: activityTask.title,
          },
          isComment,
        });
        if (isComment) this.updateBoard(board);
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
          title: "Sorry, There was a problem with your request.",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "error",
            popup: "error",
          },
          toast: true,
          animation: true,
        });
      }
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
      try {
        await this.$store.dispatch({
          type: "updateBoard",
          editedBoard: board,
        });
        this.$store.commit({ type: "setTask", taskId: this.taskId });
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
          title: "Sorry, Could not update the board. " + err,
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "error",
            popup: "error",
          },
          toast: true,
          animation: true,
        });
      }
    },
    closeModal() {
      this.$router.push(`/board/${this.$route.params.boardId}`);
    },
    calcPos(ev) {
      if (this.setPos.x) {
        this.setPos.y = ev.clientY + ev.offsetY - 100;
      } else {
        if (this.currClientWidth !== ev.view.innerWidth) {
          this.setPos.x = ev.pageX / 2 - 504;
        }
        this.setPos.y = ev.clientY + ev.offsetY - 100;
        // this.setPos.x = (ev.view.innerWidth - ev.clientX) - ev.clientX / 6 - 304
        this.setPos.x = ev.pageX / 2 - 504;
        this.currClientWidth = ev.view.innerWidth;
      }
      console.log(ev.pageX / 4);
    },
    togglePopUp(boolean, actionType, ev) {
      this.openPopUp = boolean;
      this.currAction = actionType;
      if (boolean) {
        this.calcPos(ev);
      }
    },
    async removeTask() {
      try {
        this.isLoading = true;
        const board = JSON.parse(JSON.stringify(this.currBoard));
        const taskIdx = this.getTask(board, true);
        const oldTask = JSON.parse(JSON.stringify(this.getTask(board)));
        const group = board.groups.find(
          (group) => group.id === this.currGroup.id
        );
        group.task.splice(taskIdx, 1);
        await this.updateBoard(board);
        this.isLoading = false;
        this.updateBoardSocket(board);
        this.$router.push("../");
        Swal.fire({
          position: "bottom-end",
          title: "Task removed successfully",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "success",
            popup: "success",
          },
          toast: true,
          animation: true,
        });
        this.saveActivity(
          `removed the task "${oldTask.title}" from "${group.title}"`
        );
      } catch (err) {
        Swal.fire({
          position: "bottom-end",
          title: "Task removed successfully",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "error",
            popup: "error",
          },
          toast: true,
          animation: true,
        });
      }
    },
    async updateTask(task) {
      const oldTask = JSON.parse(JSON.stringify(this.currTask));
      const group = this.currBoard.groups.find(
        (group) => group.id === this.currGroup.id
      );
      const taskIdx = this.getTask(this.currBoard, true);
      group.task.splice(taskIdx, 1, task);
      if (oldTask.title !== task.title)
        this.saveActivity(
          `changed the task "${oldTask.title}" to "${task.title}"`
        );
      await this.updateBoard(this.currBoard);
      this.updateBoardSocket(this.currBoard);
    },
    updateTaskByKey(ev, task) {
      if (ev.keyCode === 13) {
        this.updateTask(task);
        return this.$refs.taskTitle.$el.blur();
      }
    },
    getTaskActivity() {
      const filteredActivities = this.currBoard.activities.filter(
        (activity) => {
          return (
            (activity.task && activity.task.id === this.currTask.id) ||
            (activity.task &&
              activity.task.id === this.currTask.id &&
              activity.isComment)
          );
        }
      );
      return filteredActivities;
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
      Swal.fire({
        position: "bottom-end",
        title: "Attachment edited successfully",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          title: "success",
          popup: "success",
        },
        toast: true,
        animation: true,
      });
    },
    removeImg(img) {
      const taskToEdit = JSON.parse(JSON.stringify(this.currTask));
      const foundIdx = taskToEdit.imgs.findIndex((img) => img.id === img.id);
      if (foundIdx < 0) return console.log("couldnt find idx");
      taskToEdit.imgs.splice(foundIdx, 1);
      if (img.src === taskToEdit.cover.src)
        taskToEdit.cover = {
          src: "",
          type: "top",
          isImg: false,
        };
      this.updateTask(taskToEdit);
      Swal.fire({
        position: "bottom-end",
        title: "Attachment removed successfully",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          title: "success",
          popup: "success",
        },
        toast: true,
        animation: true,
      });
    },
    setCoverImg(toggler, imgSrc) {
      const taskToEdit = JSON.parse(JSON.stringify(this.currTask));
      taskToEdit.cover.isImg = toggler;
      taskToEdit.cover.src = imgSrc;
      if (!toggler) taskToEdit.cover.type = "top";
      this.updateTask(taskToEdit);
    },
    updateBoardSocket(board) {
      this.$emit("updateBoardSocket", board);
    },
    toggleLoader(condition) {
      this.isLoading = condition;
    },
    logComment(commentTxt) {
      this.saveActivity(commentTxt, true);
    },
  },
  created() {
    this.$store.commit({ type: "setTask", taskId: this.taskId });
    this.taskCopy = this.currTask;
    socketService.setup();
    socketService.on("board updated", (board) => {
      console.log("got board", board);
      this.updateBoard(board);
    });
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
    loader,
    comments,
  },
};
</script>