<template>
    <section v-if="showModal"  class="quick-edit-modal"> 
         <section class="quick-edit">
            <input type="text">
            <div class="quick-edit-menu">
                <ul>
                    <li>archive</li>
                    <li>archive</li>
                    <li>archive</li>
                    <li>archive</li>
                </ul>
            </div>
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
