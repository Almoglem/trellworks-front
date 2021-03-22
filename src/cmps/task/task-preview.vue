<template>
	<section
		@mouseover="toggleEditPen(true)"
		@mouseleave="toggleEditPen(false)"
		@click="getDetails"
		class="task-preview clickable"
	>
		<div class="full-cover" v-if="task.cover.src && task.cover.type==='full'">
			<div class="cover-color" v-if="!task.cover.isImg"> </div>
			<div class="cover-img" v-if="task.cover.isImg"> </div>
		</div>
		<div class="top-cover" v-if="task.cover.src && task.cover.type==='top'">
			<div class="cover-color" v-if="!task.cover.isImg" :style="{backgroundColor: task.cover.src}"> </div>
			<div class="cover-img" v-if="task.cover.isImg"> 
				<img :src="task.cover.src" />
			</div>
		</div>

		<div class="task-preview-main">
		<div class="task-preview-labels" v-if="task.labelIds.length && currBoard">
			<labels-preview
				v-for="labelId in task.labelIds"
				:key="labelId"
				:labelId="labelId"
				:fromPreview="true"
			/>
		</div>
		<p class="task-preview-title">{{ task.title }}</p>
		<div class="preview-footer-container flex">
			<dueDatePreview v-if="task.dueDate" :task="task" @dueDateUpdated="updateDueDate"/>
			<i v-if="task.description" class="fas fa-align-left fa-sm"></i>
			<i
				v-if="isEditPenShown"
				:class="penToggler"
				@click.stop="toggleEdit(true)"
			></i>
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
		};
	},
	computed: {
		currBoard() {
			return this.$store.getters.currBoard;
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
		toggleEditPen(boolean) {
			this.isEditPenShown = boolean;
		},
		toggleEdit(boolean) {
			this.isEditPenShown = false;
			this.showEdit = boolean;
		},
		updateDueDate(task){
			this.$emit('updateDueDate',task)
		}
	},
	computed: {
		penToggler() {
			return { "fas fa-pencil-alt edit-pen": this.isEditPenShown };
		},
	},
	created() {
		this.currBoard = this.$store.getters.currBoard;
	},
	components: {
		quickEdit,
		labelsPreview,
		Avatar,
		dueDatePreview
	},
};
</script>

    