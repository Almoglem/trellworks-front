<template>
    <section v-if="showModal" @click.stop="closeEdit" class="quick-edit"> 
        <input type="text">
        <div class="quick-edit-menu">
            <ul>
                <li>archive</li>
                <li>archive</li>
                <li>archive</li>
                <li>archive</li>
            </ul>
        </div>
        
         <section class="quick-edit-modal">
        </section>
  </section>
</template>

<script>
export default {
    data(){
        return {
            showModal: true
        }
    },
    methods: {
        closeEdit(){
            this.$emit('toggleEdit', false)
        }
    }
}
</script>
