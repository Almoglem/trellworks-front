<template>
    <section class="pop-up" ref="popUp" @click.stop="closePopUp(true)">
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
    props: {
        setPopUpHeight: Boolean
    },  
    data(){
        return {
            popUpHeight: 0,
            popUpWidth: 0
        }
    },
    computed: {

    },
    methods: {
        closePopUp(boolean){
            if(boolean) return
            this.$emit('closePopUp', boolean)
        },
        setHeight(){
            this.popUpHeight = this.$refs.popUp.clientHeight;
            this.popUpWidth = this.$refs.popUp.clientWidth;
        }
    },
    watch: {
        '$refs.popUp.clientHeight'(){
            console.log('watch from clientheight');
        }
    },
    mounted(){
        console.log('hey');
        this.setHeight()
        this.$emit('setHeight', this.popUpHeight, this.popUpWidth)
    }
}
</script>