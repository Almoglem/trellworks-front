<template>
    <section class="comment-add">
        <form @submit.prevent="postComment">
            <input type="text" v-model="comment" placeholder="Write a comment...">
            <button class="button-success">Post</button>
        </form>
    </section>
</template>

<script>

export default ({
    data(){
        return{comment:''}
    },
    methods:{
        postComment(){
            this.$emit('postComment',this.comment)
            this.comment=''
        }
    }
})
</script>
