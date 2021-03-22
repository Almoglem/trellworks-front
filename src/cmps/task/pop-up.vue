<template>
    <section class="pop-up" @click.stop="closePopUp(true)">
        <div class="pop-up-header">
            <slot name="header">  </slot><i class="fas fa-times" @click.stop="closePopUp(false)"></i>
        </div>
        <div class="main-pop-up">
        <slot></slot>

        </div>
    </section>  
</template>

<script>
export default {
    methods: {
        closePopUp(boolean){
            if(boolean) return
            this.$emit('closePopUp', boolean)
        }
    }
}
</script>