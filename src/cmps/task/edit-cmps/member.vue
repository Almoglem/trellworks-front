<template>
	<section class="task-members-edit">
		<input
			class="pop-up-input"
			v-model="filterTxt"
			@input="filterMembers"
			placeholder="Search members..."
		/>
		<h3 class="pop-up-title">Members</h3>
		<span
			v-for="member in membersToShow"
			:key="member.id"
			class="flex member-list"
			@click="addMember(member)"
		>
			<userPic :user="member" :size="30" />
			<p>{{ member.fullname }}</p>
			<i v-if="checkIfMemberExists(member)" class="far fa-check-square"></i>
			<i v-else class="far fa-square"></i>
		</span>
	</section>
</template>
<script>
import userPic from "../../recurring-cmps/user-pic.vue";

export default {
	props: {
		task: Object
	},
	data() {
		return {
			filterTxt: ''
		}
	},
	computed: {
		membersToShow() {
			return this.$store.getters.boardMembersForShow
		},
		taskMembers() {
			return JSON.parse(JSON.stringify(this.currTask.taskMembers))
		},
		boardMembers() {
			return this.$store.getters.currBoardMembers
		},
		taskToEdit(){
			return JSON.parse(JSON.stringify(this.task))
		}
	},
	methods: {
		filterMembers() {
			this.$store.commit({ type: 'setMembersFilter', filterTxt: this.filterTxt })
		},
		addMember(member) {
			const idx = this.taskToEdit.members.findIndex(taskMember => taskMember._id === member._id)
			if (idx !== -1) this.taskToEdit.members.splice(idx, 1)
			else this.taskToEdit.members.push(member)
			this.$emit('updateTask', this.taskToEdit)
		},
		checkIfMemberExists(member) {
			if (this.task.members.find(taskMember => taskMember._id === member._id)) return true
		}
	},
	created() {
		this.filterTxt = ''
		this.filterMembers()

	},
	components: { userPic }
}
</script>
