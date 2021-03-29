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
				<img v-if="!currTask.cover.isNote" :src="currTask.cover.src" />
				<img v-else :src="`data:image/png;base64,${currTask.cover.src}`" />
			</div>
			<div class="task-details-main">
				<div class="details-header">
					<textarea-autosize
						spellcheck="false"
						v-model="currTask.title"
						rows="1"
						ref="taskTitle"
						@keypress.native="updateTaskByKey($event, currTask)"
						@change.native="updateTask(currTask)"
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
								<h1 class="uppercase-title">Members</h1>
								<section class="flex members-preview">
									<span
										class="flex avatar"
										v-for="member in currTask.members"
										:key="member._id"
										@click="showProfile(member)"
									>
										<span @click="currMember = member">
													<userPic :user="member" :size="32" />
									</span>
									</span>
									<span
										@click.stop="togglePopUp(true, actions[0], $event)"
										class="add-member-label"
										><i class="fas fa-plus"></i
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
									<span
										@click.stop="togglePopUp(true, actions[1], $event)"
										class="add-member-label"
										><i class="fas fa-plus"></i
									></span>
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
							@renderCanvas="renderCanvas"
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
						<comments
							@postReply="postReply"
							@postComment="logComment"
							:commentToReply="commentToReply"
							@cancelReply="setCommentToReply('off')"
						/>
						<activityLog
							@replyClicked="setCommentToReply"
							class="task-details-activity"
							:activities="taskActivity"
							:showtoggleActivity="true"
							@toggleActivity="toggleshowActivity"
						/>
					</section>
					<div class="action-bar flex column">
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
								@setHeight="setHeight"
							>
								<template v-slot:header>{{ currAction.txt }}</template>
								<component
									:is="currAction.type"
									@updateBoard="updateBoard"
									@updateTask="updateTask"
									@logActivity="saveActivity"
									@close="togglePopUp(false)"
									@toggleLoader="toggleLoader"
									:task="currTask"
									:canvasImgSetup="canvasImgSetup"
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
import taskCanvas from "@/cmps/task/edit-cmps/canvas"
import activityLog from "@/cmps/recurring-cmps/activity-list";
import popUp from "@/cmps/task/pop-up";
import attachmentsPreview from "@/cmps/task-details/attachments-preview.vue";
import comments from "@/cmps/task-details/comments.vue";
import dueDateDetails from "@/cmps/task-details/due-date-details.vue";
import labelsPreview from "../cmps/task-details/labels-preview.vue";
import taskDescription from "../cmps/task-details/task-description.vue";
import checklist from "../cmps/task-details/checklist";
import memberProfile from "../cmps/recurring-cmps/user-miniprofile.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { socketService } from "@/services/socket.service";
import { utilService } from "@/services/util.service";
import loader from "@/cmps/recurring-cmps/loader";
import userPic from "@/cmps/recurring-cmps/user-pic.vue";

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
				{
					txt: "Canvas",
					type: "taskCanvas",
					iconClass: "fas fa-palette"
				}
			],
			currAction: null,
			openPopUp: false,
			isLoading: false,
			setPos: { x: 0, y: 0 },
			currClientWidth: 0,
			currClientHeight: 0,
			popUpHeight: 0,
			commentToReply: null,
			showActivity:true,
			canvasImgSetup: false
		};
	},
	computed: {
		taskActivity() {
			const showActivity = this.showActivity
			if (showActivity === true ){return this.currBoard.activities.filter((activity) => {
				return (
					(activity.task && activity.task.id === this.currTask.id)
				);
			})}
			else {return this.currBoard.activities.filter((activity) => {
				return (
					(activity.task && activity.task.id === this.currTask.id) &&  activity.isComment )
				
			})}
			}
		,
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
			if(this.currAction.type === 'taskCanvas') return {  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
			else return { left: this.setPos.x + "px", top: this.setPos.y + "px" };
		},
	},
	methods: {
		toggleshowActivity(boolean){
        this.showActivity = boolean
		},
		postReply(txt) {
			const comment = this.commentToReply
			comment.replies.push({
				title: txt,
				byMember: this.loggedInUser || { fullname: 'Guest' },
				createdAt: Date.now(),
			})
			this.saveActivity(`replied to a comment on "${this.currTask.title}"`);
			this.updateBoard(this.currBoard);
			this.updateBoardSocket(this.currBoard);
			this.commentToReply = null
		},
		setCommentToReply(commentId) {
			if (commentId === 'off') this.commentToReply = null
			this.commentToReply = this.currBoard.activities.find(activity => activity.id === commentId)
		},
		removeChecklist(idx) {
			const task = this.currTask;
			task.checklists.splice(idx, 1);
			this.updateTask(task);
		},
		async saveActivity(activityTitle, isComment = false) {
			try {
				const activityTask = this.currTask;
				const activity = {
					byMember: this.loggedInUser || { fullname: "Guest", _id:"000" },
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
				}
				if (activity.isComment) activity.replies = []
				this.currBoard.activities.unshift(activity);
				if(this.currBoard.activities.length > 50) this.currBoard.activities.splice(this.currBoard.activities.length-1, 1)
				if (isComment) {
					this.updateBoard(this.currBoard);
					this.updateBoardSocket(this.currBoard);
				}
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
		setHeight(popUpHeight, popUpWidth) {
			this.popUpHeight = popUpHeight;
			this.popUpWidth = popUpWidth;
			if (this.currClientHeight - this.setPos.y < this.popUpHeight)
				this.setPos.y -= popUpHeight / 2;
			// if(this.currAction.type === 'taskCanvas') this.setPos.y += 70
			if (
				this.currClientHeight - this.setPos.y < this.popUpHeight &&
				this.popUpHeight > this.setPos.y
				// this.currClientHeight + this.setPos.y > this.popUpHeight
			)
				return
			else this.setPos.y += popUpHeight / 2;
			if(this.setPos.x + 150 < this.popUpWidth) this.setPos.x += 300
			if(this.currClientWidth < 426) this.setPos.x = this.currClientWidth / 2
		},
		calcPos(ev) {
			this.currClientHeight = ev.view.innerHeight;
			this.currClientWidth = ev.view.innerWidth;
			if (this.currClientWidth !== ev.view.innerWidth) {
				this.setPos.x = ev.pageX - 150;
			}
			this.setPos.y = ev.pageY;
			this.setPos.x = ev.pageX - 150;
			// }
		},
		togglePopUp(boolean, actionType, ev) {
			this.openPopUp = false;
			setTimeout(() => {
				this.openPopUp = boolean;
			}, 0);
			this.currAction = actionType;
			if (boolean) {
				this.calcPos(ev);
			} else this.canvasImgSetup = false
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
				this.updateBoard(board);
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
					`changed the task "${oldTask.title}" to "${this.task.title}"`
				);
			this.updateBoard(this.currBoard);
			this.updateBoardSocket(this.currBoard);
		},
		updateTaskByKey(ev, task) {
			if (ev.keyCode === 13) {
				this.updateTask(task);
				return this.$refs.taskTitle.$el.blur();
			}
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
			const foundIdx = taskToEdit.imgs.findIndex((currImg) => currImg.id === img.id);
			if (foundIdx < 0) return console.log("couldnt find idx");
			taskToEdit.imgs.splice(foundIdx, 1);
			if (img.src === taskToEdit.cover.src)
				taskToEdit.cover = {
					src: "",
					type: "top",
					isImg: false,
				};
				// this.saveActivity( `removed an attachment from "${this.taskToEdit.title}"`)
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
		setCoverImg(toggler, img) {
			const taskToEdit = JSON.parse(JSON.stringify(this.currTask));
			taskToEdit.cover.isImg = toggler;
			taskToEdit.cover.src = img.src;
			if(img.isNote) taskToEdit.cover.isNote = true
			else taskToEdit.cover.isNote = false
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
			this.saveActivity(`posted a comment to "${this.currTask.title}"`);
		},
		renderCanvas(img, ev){
			this.canvasImgSetup = img
			this.togglePopUp(true, this.actions[6], ev)
		}
	},
	created() {
		this.$store.commit({ type: "setTask", taskId: this.taskId });
		socketService.setup();
		socketService.on("board updated", (board) => {
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
		taskCanvas,
		userPic,
		memberProfile,
		attachmentsPreview,
		dueDateDetails,
		loader,
		comments,
	},
};
</script>