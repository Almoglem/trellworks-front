<template>
	<div class="flex board-header">
		<div class="flex header-container" @submit.prevent="editBoardTitle">
			<input
				class="clean-input"
				v-model="titleToEdit"
				v-if="isEditing"
				ref="titleInput"
				@keypress.enter="editBoardTitle"
				@focusout="editBoardTitle"
			/>
			<h2 @click="getInput" v-else>{{ titleToEdit }}</h2>
			<button class="header-btn star" @click="starBoard">
				<i v-if="!currBoard.isStarred" class="far fa-star"></i
				><i v-else class="fas fa-star"></i>
			</button>

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
			<button class="header-btn invite" @click="showUsers">Invite</button>
		</div>
		<button @click="menuShown = !menuShown" class="header-btn">
			Show Menu
		</button>
		<transition name="slide-from-right">
			<boardMenu
				class="board-menu"
				v-if="menuShown"
				@closeMenu="menuShown = !menuShown"
			></boardMenu>
		</transition>
		<div
			:class="{ 'pop-up-window': userWindow }"
			@mousedown.self="userWindow = !userWindow"
		>
			<div v-if="userWindow" class="pop-up">
				<h3 class="pop-up-title">Invite to board</h3>
				<hr />
				<input
					type="text"
					v-model="searchTxt"
					placeholder="Search Trellworks members..."
				/>
				<li
					v-for="user in filteredMembers"
					@click="toggleBoardMember(user)"
					:key="user._id"
					class="search-members flex"
				>
        <span class=" flex">
					<avatar :size="30" :username="user.fullname"></avatar>
					<i v-if="isUserInBoard(user._id)" class="fas fa-check"></i>
          </span>
					{{ user.fullname }}
				</li>
			</div>
		</div>
	</div>
</template>

<script>
import boardMenu from "./menu.vue";
import memberProfile from "../recurring-cmps/user-miniprofile.vue";
import Avatar from "vue-avatar";

export default {
	data() {
		return {
			menuShown: false,
			titleToEdit: null,
			isEditing: false,
			showMemberProfile: false,
			currMember: null,
			userWindow: false,
			searchTxt: '',

		};
	},
	computed: {
		boardMembers() {
			return this.$store.getters.currBoardMembers;
		},
		users() {
			return this.$store.getters.users;
		},
		currBoard() {
			return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
		},
		filteredMembers() {
			if (!this.searchTxt) return this.users
			return this.users.filter(user => user.fullname.toLowerCase().includes(this.searchTxt.toLowerCase()))
		}
	},
	methods: {
		async loadUsers() {
			await this.$store.dispatch({ type: "loadUsers" });
		},
		editBoardTitle() {
			this.isEditing = !this.isEditing;
			this.$emit("boardTitleUpdated", this.titleToEdit);
		},
		showProfile(member) {
			this.currMember = member;
			this.showMemberProfile = true;
		},
		hideProfile() {
			this.showMemberProfile = false;
		},
		getInput() {
			this.isEditing = !this.isEditing;
			setTimeout(() => {
				this.$refs.titleInput.focus();
			}, 0);
		},
		showUsers() {
			this.userWindow = !this.userWindow;
		},
		toggleBoardMember(user) {
			const userToAdd = {
				_id: user._id,
				fullname: user.fullname,
			};
			const foundIdx = this.currBoard.members.findIndex(
				(member) => member._id === user._id
			);
			if (foundIdx !== -1) {
				this.currBoard.members.splice(foundIdx, 1)
				return this.$emit("updateBoard", this.currBoard);
			}
			this.currBoard.members.push(userToAdd);
			this.$emit("updateBoard", this.currBoard);
		},
		starBoard() {
			this.currBoard.isStarred = !this.currBoard.isStarred;
			this.$emit("updateBoard", this.currBoard);
		},
		isUserInBoard(userId) {
			const user = this.currBoard.members.find(boardUser => boardUser._id === userId)
			if (user) return true
			else return false
		},
		},
		async created() {
			console.log('hii');
			await this.loadUsers();
			this.titleToEdit = this.currBoard.title;
			console.log(this.users);
			console.log('hiiiiiiiii');
	},

	components: { boardMenu, Avatar, memberProfile }
}
</script>