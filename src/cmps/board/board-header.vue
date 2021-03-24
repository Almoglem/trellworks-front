<template>
	<div class="flex board-header">
		<div class="flex header-container" @submit.prevent="editBoardTitle">
			<input class="clean-input" v-model="titleToEdit" v-if="isEditing" ref="titleInput" 
			@keypress.enter="editBoardTitle"
			@focusout="editBoardTitle" />
			<h2 @click="getInput" v-else>{{ boardTitle }}</h2>
			<button  class="header-btn star" @click="starBoard"><i v-if="!currBoard.isStarred" class="far fa-star"></i><i v-else class="fas fa-star"></i></button>
			
			<ul class="flex avatars-show">
				<span
					v-for="member in boardMembers"
					:key="member._id"
					class="clickable transition board-header-avatar"
					@click="showProfile(member)"
				>
				<span @click="currMember = member">
					<avatar :size="30" :username="member.fullname"></avatar
				></span>
				</span>
				<memberProfile
					:currMember="currMember"
					v-if="showMemberProfile"
					@closeProfile="hideProfile"
				/>
			</ul>
			<button class="header-btn invite" @click="showUsers">Invite to Board</button>
		</div>
		<button @click="menuShown = !menuShown" class="header-btn">
			Show Menu
		</button>
		<transition name="slide-from-right">
			<boardMenu
				class="board-menu"
				v-if="menuShown"
				@closeMenu="menuShown = !menuShown"
				@bgcChanged="changeBgc"
			></boardMenu>
		</transition>
		<div :class="{'pop-up-window': userWindow}" @click.self="userWindow = !userWindow">
			<div v-if="userWindow" class="pop-up">
				<h3 class="pop-up-title">Invite to board</h3>
				<hr>
			<li v-for="user in users" @click="toggleBoardMember(user)" :key="user._id">{{user.fullname}}</li>
			</div>
		</div>
	</div>
</template>

<script>
import boardMenu from "./menu.vue";
import memberProfile from "../recurring-cmps/user-miniprofile.vue"
import Avatar from "vue-avatar";

export default {
	props: {
		boardTitle: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			menuShown: false,
			titleToEdit: this.boardTitle,
			isEditing: false,
			showMemberProfile: false,
			currMember: null,
			userWindow: false
		};
	},
	computed: {
		boardMembers() {
			return this.$store.getters.currBoardMembers;
		},
		users(){
			return this.$store.getters.users
		},
		currBoard(){
			return JSON.parse(JSON.stringify(this.$store.getters.currBoard))
		},

	},
	methods: {
		async loadUsers(){
			await this.$store.dispatch({type: 'loadUsers'});
		},
		editBoardTitle() {
			this.isEditing = !this.isEditing;
			this.$emit("boardTitleUpdated", this.titleToEdit);
		},
		showProfile(member) {
			this.currMember = member
			this.showMemberProfile = true
		},
		hideProfile() {
			this.showMemberProfile = false
		},
		changeBgc() {
			this.$emit('changeBgc')
		},
		getInput(){
			this.isEditing = !this.isEditing
			setTimeout(() => {
				this.$refs.titleInput.focus()
			}, 0);
		},
		showUsers(){
			this.userWindow = !this.userWindow
		},
		toggleBoardMember(user){
			const userToAdd = {
				_id: user._id,
				fullname: user.fullname
			}
			const foundIdx = this.currBoard.members.findIndex(member => member._id === user._id)
			if(foundIdx !== -1) {
				this.currBoard.members.splice(foundIdx, 1)
				return this.$emit('updateBoard', this.currBoard)
			}
			this.currBoard.members.push(userToAdd)
			this.$emit('updateBoard', this.currBoard)
		}	,
		starBoard(){
			this.currBoard.isStarred = !this.currBoard.isStarred
			this.$emit('updateBoard',this.currBoard)
		}
	},
	async created() { 
		await this.loadUsers()
	},
	components: { boardMenu, Avatar, memberProfile },
};
</script>