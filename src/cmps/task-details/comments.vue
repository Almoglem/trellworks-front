<template>
	<section class="comment-add">
		<form v-if="commentToReply" @submit.prevent="postReply">
			<p>Reply to: <span class="muted-txt">{{ commentToReply.title }}</span></p>
			<input type="text" v-model="comment" placeholder="Write a reply..." />
			<button class="btn-success">Post</button>
			<button class="btn-gray" @click.prevent="cancelReply">Cancel</button>
		</form>
		<form v-else @submit.prevent="postComment">
			<input type="text" v-model="comment" placeholder="Write a comment..." />
			<button class="btn-success">Post</button>
            <button class="btn-gray" @click.prevent="comment=''">Cancel</button>
		</form>
	</section>
</template>

<script>

export default ({
	props: ['commentToReply']
	,
	data() {
		return { comment: '' }
	},
	computed: {
		loggedInUser() {
			return JSON.parse(JSON.stringify(this.$store.getters.loggedinUser));
		},
	},
	methods: {
		postComment() {
            if(this.comment === '') return
			this.$emit('postComment', this.comment)
			this.comment = ''
		},
		cancelReply() {
			this.$emit('cancelReply')
            this.comment = ''
		},
		postReply() {
            if(this.comment === '') return
			this.$emit('postReply', this.comment)
            this.comment = ''
		}
	}
	,

})
</script>
