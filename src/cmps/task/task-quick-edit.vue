<template>
  <section class="quick-edit">
      edit will be here
      <div v-if="showModal" @click.stop="closeEdit" class="quick-edit-modal"></div>
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
