<template>
  <section class="canvas">
      <h3 class="pop-up-title">draw your note</h3>
        <div class="canvas-container">
            <canvas @mousedown="startPainting" 
            @mouseup="finishedPainting"
            @mousemove="draw"
            height="330" width="277" style="border: 1px solid black;" 
            id="canvas"></canvas>
        </div> 
        <div class="canvas-config">
            <div class="canvas-colors">
                <label>Background
                    <canvas-bgc @setBgc="setBgc"/>
                </label>
                <label>Color
                    <canvas-color @setColor="setColor"/>
                </label>
            </div>
            <div class="canvas-update">
                <canvas-font-size @setPenWidth="setPenWidth" />
                <button class="btn-success clear" @click="setBgc('white')">Clear</button>
                <button  @click="downloadImg" class="btn-success">Save note</button>
            </div>
        </div>
<!-- EDIT PICTURES -->
  </section>
</template>

<script>
import { utilService } from "@/services/util.service.js";
import canvasColor from '@/cmps/elementui/canvas-color-select'
import canvasBgc from '@/cmps/elementui/canvas-bgc-select'
import canvasFontSize from '@/cmps/elementui/canvas-fontsize-select'
export default {
    props: ['task', 'canvasImgSetup'],
    data() {
       return {
            painting:false,
            canvas:null,
            ctx:null,
            currColor: 'black',
            currWidth: 4,
            taskToEdit: JSON.parse(JSON.stringify(this.task))
       }
    },
    methods: {
        setColor(color){
            this.currColor = color
        },
        setBgc(bgc){
            this.ctx.fillStyle = bgc;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);        
        },
        setPenWidth(size){
            this.currWidth = size
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
            this.ctx.lineWidth = this.currWidth
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
                this.$emit(
                "logActivity",
                `added an attachment to "${this.taskToEdit.title}"`
                );
                this.$emit("updateTask", this.taskToEdit);
                this.$emit("close");

            }
            catch(err) {
                Swal.fire({
                    position: "bottom-end",
                    title: "Sorry, There was a problem with uploading your image.",
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                        title: "error",
                        popup: "error",
                    },
                    toast: true,
                    animation: true,
                });
            }
            finally {
                this.$emit("toggleLoader", false);
            }
        }
    },
    mounted() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d"); 
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);  
        if(this.canvasImgSetup) {
            const img = new Image();
            if(this.canvasImgSetup.isNote) img.src = `data:image/png;base64,${this.canvasImgSetup.src}`
            else img.src = this.canvasImgSetup.src
            img.setAttribute('crossorigin', 'anonymous'); 
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        }
    },
    components: {
        canvasColor,
        canvasBgc,
        canvasFontSize
    }
}
</script>