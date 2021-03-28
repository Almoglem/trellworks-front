<template>
  <section class="canvas">
      <h3 class="pop-up-title">draw your note</h3>
        <div class="canvas-container">
            <canvas @mousedown="startPainting" 
            @mouseup="finishedPainting"
            @mousemove="draw"
            height="406" width="277" style="border: 1px solid black;" 
            id="canvas"></canvas>
        </div> 
        <div class="canvas-config">
            <el-select @setColor="setColor"/>
            <button  @click="downloadImg" class="btn-success">Save note</button>
        </div>
<!-- ADD CLEAR BUTTON, CHANGE BACKGROUND BUTTON AND EDIT PICTURES-->
  </section>
</template>

<script>
import { utilService } from "@/services/util.service.js";
import elSelect from '@/cmps/elementui/select'
export default {
    props: {
        task: Object
    },
    data() {
       return {
            painting:false,
            canvas:null,
            ctx:null,
            currColor: 'black',
            taskToEdit: JSON.parse(JSON.stringify(this.task))
       }
    },
    methods: {
        setColor(color){
            this.currColor = color
        },
        startPainting(e) {
        this.painting = true;
        this.draw(e)
        },
        finishedPainting() {
        this.painting = false;
        this.ctx.beginPath()
        },
        draw(e) {
            if(!this.painting) return
            this.ctx.strokeStyle = this.currColor
            this.ctx.lineWidth = 10;
            this.ctx.lineCap ="round"
    
            this.ctx.lineTo(e.offsetX,e.offsetY)
            this.ctx.stroke()

            this.ctx.beginPath()
            this.ctx.moveTo(e.offsetX,e.offsetY)
        },
        downloadImg() {
            try {
                this.$emit("toggleLoader", true);
                const canvasImg  = this.canvas.toDataURL("image/png");
                const imgUrl = canvasImg.substring(22, canvasImg.length)
                const img = {
                    id: utilService.makeId(),
                    src: imgUrl,
                    name: `Your Image`,
                    createdAt: Date.now(),
                    isNote: true
                };
                if (!this.taskToEdit.cover.src) {
                    this.taskToEdit.cover.src = img.src;
                    this.taskToEdit.cover.type = "top";
                    this.taskToEdit.cover.isImg = true;
                    this.taskToEdit.cover.isNote = true;
                }
                this.taskToEdit.imgs.unshift(img);
                console.log(this.taskToEdit);
                this.$emit(
                "logActivity",
                `added an attachment to "${this.taskToEdit.title}"`
                );
                this.$emit("updateTask", this.taskToEdit);
                this.$emit("close");

            }
            catch(err) {
                console.log(err);
            }
            finally {
                this.$emit("toggleLoader", false);
            }
        }
    },
    mounted() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");   
        console.log('task', this.task); 
        
    },
    components: {
        elSelect
    }
}
</script>