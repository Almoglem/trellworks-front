<template>
	<section
		@mouseover="toggleEditPen(true)"
		@mouseleave="toggleEditPen(false)"
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
			<!-- <div class="full-cover" v-if="task.cover.src && task.cover.type==='full'">
			<div class="cover-color" v-if="!task.cover.isImg"> </div>
			<div class="cover-img" v-if="task.cover.isImg"> </div>
		</div> -->
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
				style="align-items: baseline"
				v-if="typeTop && footerIsShown"
			>
				<dueDatePreview
					v-if="task.dueDate"
					:task="task"
					@dueDateUpdated="updateDueDate"
				/>
				<i v-if="task.description" class="fas fa-align-left fa-sm"></i>
				<i
					v-if="isEditPenShown"
					:class="penToggler"
					@click.stop="toggleEdit(true)"
				></i>
				<span class="checklist-preview" :class="{success:areTodosCompleted}" v-if="task.checklists">
					<i v-if="task.checklists.length" class="far fa-check-square"></i>
					{{getChecklsitString}}
				</span>
				<span class="flex preview-avatar-container">
					<span class="avatar" v-for="member in task.members" :key="member.id">
						<avatar
							v-if="task.members.length"
							:size="20"
							:username="member.fullname"
						></avatar>
					</span>
				</span>
			</div>
		</div>
		<!-- <quick-edit @toggleEdit="toggleEdit" v-if="showEdit"/> -->
	</section>
</template>

<script>
import labelsPreview from "../task-details/labels-preview.vue";
import quickEdit from "./task-quick-edit";
import Avatar from "vue-avatar";
import dueDatePreview from "@/cmps/task/due-date-preview.vue";


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
			isEditPenShown: false,
			showEdit: false,
			areTodosCompleted:false
		};
	},
	computed: {
		currBoard() {
			return this.$store.getters.currBoard;
		},
		bgcToShow() {
			if (this.task.cover.src && this.task.cover.type === 'full' && this.task.cover.isImg) return { backgroundImage: `url(${this.task.cover.src})` }
			else if (this.task.cover.src && this.task.cover.type === 'full' && !this.task.cover.isImg) return { backgroundColor: this.task.cover.src }
			else return { backgroundColor: '#fff' }
		},
		setCoverImgFull() {
			return { 'cover-img-full': this.task.cover.isImg && this.task.cover.type === 'full' }
		},
		setCoverFullTitle() {
			return {
				'cover-txt-full': this.task.cover.type === 'full',
				'full-height': !this.task.cover.isImg && this.task.cover.type === 'full'
			}
		},
		typeTop() {
			return this.task.cover.type === 'top' ? true : false
		},
		typeFullFont() {
			if (this.task.cover.type === 'full' && this.task.cover.src === '#344563') return { fontSize: '16px', fontWeight: 700, color: '#fff' }
			if (this.task.cover.type === 'full') return { fontSize: '16px', fontWeight: 700 }
		},
		penToggler() {
			return { "fas fa-pencil-alt edit-pen": this.isEditPenShown };
		},
		footerIsShown() {
			if (this.task.dueDate || this.task.description || this.task.members.length || this.task.checklists) return true
			else return false
		},
				getChecklsitString() {
					console.log(this.task);
			if(!this.task.checklists)return
			let allTodos=0
			let doneTodos=0
			this.task.checklists.forEach(checklist => {
				if (checklist.todos) {
					checklist.todos.forEach(todo=> {
						if(todo.isDone)doneTodos++
					})
					allTodos += checklist.todos.length
				}
			})
			if(!allTodos) return
			if (doneTodos === allTodos && allTodos > 0) this.areTodosCompleted = true
			console.log(`${doneTodos}/${allTodos}`);
			return `${doneTodos}/${allTodos}`
		}
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
		toggleEditPen(boolean) {
			this.isEditPenShown = boolean;
		},
		toggleEdit(boolean) {
			this.isEditPenShown = false;
			this.showEdit = boolean;
		},
		updateDueDate(task) {
			this.$emit('updateDueDate', task)
		},

	},
	created() {
	},
	components: {
		quickEdit,
		labelsPreview,
		Avatar,
		dueDatePreview
	},
};
</script>

    