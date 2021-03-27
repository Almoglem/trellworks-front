<template>
  <section class="canvas">
      <h3 class="pop-up-title">draw your note</h3>
        <div class="canvas-container">
            <canvas 
            @mousedown="startPainting" 
            @mouseup="finishedPainting"  
            @mousemove="draw" 
            id="canvas" 
            height="406" width="277" style="border: 1px solid black;">
            </canvas>
        </div>

  </section>
</template>

<script>
export default {
    data(){
        return {
            canvas:null,
            ctx:null,
            vueCanvas: null,
            painting:false
        }
    },
    methods: {
        startPainting() {
            this.painting = true;
            console.log(this.painting)
        },
        finishedPainting() {
            this.painting = false;
            console.log(this.painting)
        },
        draw(e) {
            if(!this.painting) return
                this.ctx.lineWidth = 10;
                this.ctx.lineCap ="round" 
            console.log("Hello...Event is Working")
        }
    },
    mounted() {
      this.canvas = document.getElementById("canvas");
      this.ctx = canvas.getContext("2d");  
      this.vueCanvas = ctx;
    },
}
</script>
