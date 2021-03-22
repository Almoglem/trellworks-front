<template>
  <div v-if="color" class="label-preview" :style="{ backgroundColor: color.color }" ><span v-if="!fromPreview">{{color.title}}</span></div>
</template>

<script>
import { boardService } from '@/services/board.service.js'
export default {
    props: ['labelId', 'fromPreview'],
    data(){
        return {
            color: ''
        }
    },
    computed: {
        currBoard(){
            return this.$store.getters.currBoard
        }
    },
    methods: {
        getColorByLabelId(){
            const color = boardService.getLabelColorById(this.currBoard, this.labelId)
            this.color = color
        }
    },
    watch: {
        currBoard(){
            this.getColorByLabelId()
        }
    },
    created(){
        this.getColorByLabelId(this.currBoard, this.labelId);
    }
}

</script>
