<template>
	<section class="menu">
		<i class="fas fa-times menu-close clickable" @click="closeMenu"></i>
		<h1>{{ setTitle }}</h1>
		<hr />
		<section v-if="menuToggler" class="menu-info">
			<ul>
				<li>About this board</li>
				<li @click="toggleColorMenu(true)">Change background</li>
				<li>Search tasks</li>
			</ul>
			<activityLog :activities="activities" />
		</section>
		<section v-else class="color-menu">
			<div class="background-options"  v-if="!colorPicker">
				<div @click="toggleColorList(true)"  class="templates">
					<div class="templates-image"></div>
					<div class="templates-title">Photos</div>
				</div>
				<div @click="toggleColorList(false)"  class="colors">
					<div class="colors-image"></div>
					<div class="colors-title">Colors</div>
				</div>
			</div >
			<div :style="{width: '100%'}" v-else>
				<div v-if="!isTemplates" class="color-list">
					<li
						class="color-preview clickable"
						@click="setBoardColor(color.color)"
						v-for="color in colorList"
						:key="color.color"
					>
						<div :style="{ backgroundColor: color.color }"></div>
					</li>
				</div>
				<div v-else class="color-list">
					<li
						class="color-preview clickable"
						v-for="(image, idx) in 9"
						:key="idx"
						@click="setBoardTemplate(idx)"
					>
						<div class="img-container">
							<img :src="require('../../assets/img/template'+ idx + '.jpg')">
						</div>
					</li>
				</div>
			</div>
		</section>
		<i
			@click="toggleColorMenu(false)"
			v-if="!menuToggler"
			class="fas fa-angle-left back-btn clickable"
		></i>
	</section>
</template>

<script>
import { boardService } from "@/services/board.service.js";
import activityLog from "../recurring-cmps/activity-list.vue";
export default {
	data() {
		return {
			openMenu: {
				colorMenu: false,
			},
			colorPicker: false,
			colorList: boardService.getAllColors(),
			isTemplates: false
		};
	},
	computed: {
		activities() {
			const activities = this.$store.getters.activityLog.filter((activity) => {
				return !activity.isComment;
			})
			const activitiesToShow = activities.slice(0,25)
			return activitiesToShow

		},
		menuToggler() {
			return this.openMenu.colorMenu ? false : true;
		},
		setTitle() {
			return this.openMenu.colorMenu ? "Change background" : "Menu";
		},
		currBoard() {
			return JSON.parse(JSON.stringify(this.$store.getters.currBoard));
		},
	},
	methods: {
		moment: function () {
			return moment();
		},
		time(date) {
			return moment(date).fromNow();
		},
		toggleColorMenu(colorMenuToggler) {
			this.openMenu.colorMenu = colorMenuToggler;
			this.colorPicker = false;
		},
		toggleColorList(colorListToggler) {
			this.colorPicker = true;
			this.isTemplates = colorListToggler;
			console.log('colorpicker', this.colorPicker, 'istemplates', this.isTemplates, 'openmenu', this.openMenu.colorMenu);
		},
		setBoardColor(color) {
			this.currBoard.styles.backgroundColor = color;
			this.currBoard.styles.backgroundImage = ''
			this.$store.dispatch({
				type: "updateBoard",
				editedBoard: this.currBoard,
			});
		},
		setBoardTemplate(idx){
			this.currBoard.styles.backgroundImage = '../img/template'+ idx + '.jpg'
			this.currBoard.styles.backgroundColor = '';
			console.log(this.currBoard);
			this.$store.dispatch({
				type: "updateBoard",
				editedBoard: this.currBoard,
			});
		},
		closeMenu() {
			this.$emit("closeMenu");
		},
		getActivities() {
			const filteredActivities = this.activities.filter(
				(activity) => {
					return !activity.isComment;
				}
			);
			return filteredActivities;
		},
	
	},
	components: { activityLog },
	created() {
	},
};
</script>