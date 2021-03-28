<template>
	<section @click="userClicked">
		<img
			v-if="user.profileImg"
			class="user-profileimg"
			:src="user.profileImg"
			alt=""
		/>
		<avatar v-else :size="size" :username="user.fullname"></avatar>
	</section>
</template>
<script>
import Avatar from "vue-avatar";

export default ({
	props: {user:Object,
    size:Number},
	data() {
		return {
            avatarSize: null
        }
	},
    computed: {
		loggedInUser() {
			console.log('!!');
			return JSON.parse(JSON.stringify(this.$store.getters.loggedinUser));
		},
	},
    methods:{
userClicked(){
    this.$emit('userClicked')
}
    },
    created(){
console.log(this.size);
    },
	components: {
		Avatar
	}
})
</script>
