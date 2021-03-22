<template>
	<div class="flex board-header">
		<div class="flex header-container" @submit.prevent="editBoardTitle">
			<form v-if="isEditing">
				<input class="clean-input" v-model="titleToEdit" />
			</form>
			<h2 v-else @click="isEditing = !isEditing">{{ boardTitle }}</h2>
			<button class="header-btn star"><i class="far fa-star"></i></button>
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
			<button class="header-btn invite">Invite to Board</button>
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
			currMember: null
		};
	},
	computed: {
		boardMembers() {
			return this.$store.getters.currBoardMembers;
		},
	},
	methods: {
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
		}
	},
	created() { },
	components: { boardMenu, Avatar, memberProfile },
};
</script>