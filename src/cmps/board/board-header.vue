<template>
	<div class="flex board-header">
		<div class="flex header-container" @submit.prevent="editBoardTitle">
			<input
				class="clean-input"
				v-model="currBoard.title"
				v-if="isEditing"
				ref="titleInput"
				@keypress.enter="editBoardTitle"
				@focusout="editBoardTitle"
			/>
			<h2 @click="getInput" v-else>{{ currBoard.title }}</h2>
			<button class="header-btn star" @click="starBoard">
				<i v-if="!currBoard.isStarred" class="far fa-star"></i
				><i v-else class="fas fa-star"></i>
			</button>

			<ul class="flex avatars-show" v-if="boardMembers.length">
				<span
					v-for="user in boardMembers"
					:key="user._id"
					class="clickable transition board-header-avatar"
					@click="showProfile(user)"
				>
					<span @click="currMember = user">
						<img
							v-if="user.profileImg"
							class="user-profileimg"
							:src="user.profileImg"
							alt=""
						/>
						<avatar v-else :size="30" :username="user.fullname"></avatar>
					</span>
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
				@bgcChanged="bgcChanged"
			></boardMenu>
		</transition>
		<div
			:class="{ 'pop-up-window': userWindow }"
			@mousedown.self="userWindow = !userWindow"
		>
			<div v-if="userWindow" :style="setCurrPos" ref="inviteMembers" class="pop-up">
				<h3 class="pop-up-title">Invite to board</h3>
				<hr />
				<input
					type="text"
					v-model="memberSearchTxt"
					placeholder="Search Trellworks members..."
				/>
				<span v-if="!memberSearchTxt">
					<h3 class="pop-up-title">Suggested users</h3>
					<li
						v-for="(user,idx) in suggestedUsers"
						@click="toggleBoardMember(user)"
						:key="idx"
						class="search-members flex"
					>
						<span class="flex">
							<img
								v-if="user.profileImg"
								class="user-profileimg"
								:src="user.profileImg"
								alt=""
							/>
							<avatar v-else :size="30" :username="user.fullname"></avatar>
							<i v-if="isUserInBoard(user._id)" class="fas fa-check"></i>
						</span>
						{{ user.fullname }}
					</li>
				</span>
         <ul class="search-users-list" >
				<li
					v-for="user in filteredMembers"
					@click="toggleBoardMember(user)"
					:key="user._id"
					class="search-members flex"
				>
					<span class="flex">
						<img
							v-if="user.profileImg"
							class="user-profileimg"
							:src="user.profileImg"
							alt=""
						/>
						<avatar v-else :size="30" :username="user.fullname"></avatar>
						<i v-if="isUserInBoard(user._id)" class="fas fa-check"></i>
					</span>
					{{ user.fullname }}
				</li>
                  </ul>

				<hr />
				<h3 class="pop-up-title">In This Board</h3>
				<li
					v-for="(user, idx) in boardMembers"
					:key="idx"
					class="search-members flex"
					@click="toggleBoardMember(user)"
				>
					<span class="flex">
						<img
							v-if="user.profileImg"
							class="user-profileimg"
							:src="user.profileImg"
							alt=""
						/>
						<avatar v-else :size="30" :username="user.fullname"></avatar>
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
import { utilService } from '@/services/util.service.js'
import memberProfile from "../recurring-cmps/user-miniprofile.vue";
import Avatar from "vue-avatar";

export default {
	data() {
		return {
			menuShown: false,
			isEditing: false,
			showMemberProfile: false,
			currMember: null,
			userWindow: false,
			memberSearchTxt: "",
			setPos: { x: 0, y: 0 },
			currClientHeight: 0,
			popUpHeight: 0,
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
			if (!this.memberSearchTxt) return;
			return this.users.filter((user) =>
				user.fullname.toLowerCase().includes(this.memberSearchTxt.toLowerCase())
			);
		},
		suggestedUsers() {
			const randomUsers = []
			for (let i = 0; i < 4; i++) {
				randomUsers.push(this.users[utilService.getRandomInt(0, this.users.length)])
			}
			return randomUsers
		},
		setCurrPos() {
			return { left: this.setPos.x + "px", top: this.setPos.y + "px" };
		},
	},
	methods: {
		bgcChanged() {
			this.$emit("changeBgc");
		},
		async loadUsers() {
			await this.$store.dispatch({ type: "loadUsers" });
		},
		editBoardTitle() {
			this.isEditing = !this.isEditing;
			this.$emit("boardTitleUpdated", this.currBoard.title);
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
		showUsers(ev) {
			this.memberSearchTxt = ''
			console.log(ev.pageY)
			this.userWindow = !this.userWindow;
			setTimeout(() => {
				this.popUpHeight = this.$refs.inviteMembers.clientHeight;
				this.calcPos(ev)
				if (this.currClientHeight - this.setPos.y < this.popUpHeight)
					this.setPos.y -= this.popUpHeight / 2;
				if (
					this.currClientHeight - this.setPos.y < this.popUpHeight &&
					this.currClientHeight + this.setPos.y > this.popUpHeight
				)
					return;
				else this.setPos.y += this.popUpHeight / 2;
			}, 0);
		},
		calcPos(ev) {
			this.currClientHeight = ev.view.innerHeight;
			if (this.currClientWidth !== ev.view.innerWidth) {
				this.setPos.x = ev.pageX + 150;
			}
			this.setPos.y = ev.pageY;
			this.setPos.x = ev.pageX + 150;
			this.currClientWidth = ev.view.innerWidth;
		},
		toggleBoardMember(user, ev) {
			const foundIdx = this.currBoard.members.findIndex(
				(member) => member._id === user._id
			);
			if (foundIdx !== -1) {
				this.setPos.y -= 19
				this.currBoard.members.splice(foundIdx, 1);
				return this.$emit("updateBoard", this.currBoard);
			}
			this.setPos.y += 19
			this.currBoard.members.push(user);
			this.$emit("updateBoard", this.currBoard);
		},
		starBoard() {
			this.currBoard.isStarred = !this.currBoard.isStarred;
			this.$emit("updateBoard", this.currBoard);
		},
		isUserInBoard(userId) {
			const user = this.currBoard.members.find(
				(boardUser) => boardUser._id === userId
			);
			if (user) return true;
			else return false;
		},
	},
	async created() {
		await this.loadUsers();
		console.log(this.currBoard.members);
	},
	destroyed() {
		this.memberSearchTxt = "";
	},
	components: { boardMenu, Avatar, memberProfile },
};
</script>