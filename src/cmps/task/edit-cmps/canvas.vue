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
        <select>
            <option value="black"></option>
            <option value="red"></option>
            <option value="brown"></option>
            <option value="yellow"></option>
            <option value="green"></option>
            <option value="blue"></option>
            <option value="purple"></option>
            <option value="pink"></option>
        </select>

  </section>
</template>

<script>
export default {
  data: {
    painting:false,
    canvas:null,
    ctx:null,
    currColor: 'black'
  },
  methods: {
    startPainting(e) {
      this.painting = true;
      console.log(this.painting)
      this.draw(e)
    },
    finishedPainting() {
      this.painting = false;
      console.log(this.painting);
      this.ctx.beginPath()
    },
    draw(e) {
        if(!this.painting) return
        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 10;
        this.ctx.lineCap ="round"
 
        this.ctx.lineTo(e.offsetX,e.offsetY)
        this.ctx.stroke()

        this.ctx.beginPath()
        this.ctx.moveTo(e.offsetX,e.offsetY)
    }
  },
    mounted() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");    
        
    }
}
</script>