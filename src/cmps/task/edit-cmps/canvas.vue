<template>
  <section class="canvas">
    <h3 class="pop-up-title">draw your note</h3>
    <div class="canvas-container">
      <canvas
        @mousedown="startPainting"
        @mouseup="finishedPainting"
        @mousemove="draw"
        @touchstart="startPaintingMobile"
        @touchend="finishedPainting"
        @touchmove="drawMobile"
        height="330"
        width="277"
        style="border: 1px solid black"
        id="canvas"
      ></canvas>
    </div>
    <div class="canvas-config">
      <div class="canvas-colors">
        <label
          >Background
          <canvas-bgc @setBgc="setBgc" />
        </label>
        <label
          >Color
          <canvas-color @setColor="setColor" />
        </label>
      </div>
      <div class="canvas-update">
        <canvas-font-size @setPenWidth="setPenWidth" />
        <button class="btn-success clear" @click="setBgc('white')">
          Clear
        </button>
        <button @click="downloadImg" class="btn-success">Save note</button>
      </div>
    </div>
  </section>
</template>

<script>
import { utilService } from "@/services/util.service.js";
import { uploadCanvas } from "@/services/img-upload.service.js";
import canvasColor from "@/cmps/elementui/canvas-color-select";
import canvasBgc from "@/cmps/elementui/canvas-bgc-select";
import canvasFontSize from "@/cmps/elementui/canvas-fontsize-select";
export default {
  props: ["task", "canvasImgSetup"],
  data() {
    return {
      painting: false,
      canvas: null,
      ctx: null,
      currColor: "black",
      currWidth: 4,
    };
  },
  computed: {
    taskToEdit() {
      return JSON.parse(JSON.stringify(this.task));
    },
  },
  methods: {
    setColor(color) {
      this.currColor = color;
    },
    setBgc(bgc) {
      this.ctx.fillStyle = bgc;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    setPenWidth(size) {
      this.currWidth = size;
    },
    startPainting(e) {
      this.painting = true;
      this.draw(e);
    },
    startPaintingMobile(e) {
      this.painting = true;
      this.drawMobile(e);
    },
    finishedPainting() {
      this.painting = false;
      this.ctx.beginPath();
    },
    draw(e) {
      if (!this.painting) return;
      this.ctx.strokeStyle = this.currColor;
      this.ctx.lineWidth = this.currWidth;
      this.ctx.lineCap = "round";

      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
    },
    drawMobile(e) {
      if (!this.painting) return;
      e.preventDefault();
      var rect = e.target.getBoundingClientRect();
      var x = e.targetTouches[0].pageX - rect.left;
      var y = e.targetTouches[0].pageY - rect.top;
      this.ctx.strokeStyle = this.currColor;
      this.ctx.lineWidth = this.currWidth;
      this.ctx.lineCap = "round";

      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    },
    async downloadImg() {
      try {
        this.$emit("toggleLoader", true);
        const canvasImg = this.canvas.toDataURL("image/png");
        const imgUrl = await uploadCanvas(canvasImg);
        const img = {
          id: utilService.makeId(),
          src: imgUrl,
          name: `Your Image`,
          createdAt: Date.now(),
        };
        if (!this.taskToEdit.cover.src) {
          this.taskToEdit.cover.src = img.src;
          this.taskToEdit.cover.type = "top";
          this.taskToEdit.cover.isImg = true;
        }
        this.taskToEdit.imgs.unshift(img);
        this.$emit(
          "logActivity",
          `added an attachment to "${this.taskToEdit.title}"`
        );
        this.$emit("updateTask", this.taskToEdit);
        this.$emit("close");
      } catch (err) {
        utilService.showErrorMsg(
          "Sorry, There was a problem with uploading your image."
        );
      } finally {
        this.$emit("toggleLoader", false);
      }
    },
  },
  mounted() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.canvasImgSetup) {
      const img = new Image();
      img.src = this.canvasImgSetup.src;
      img.setAttribute("crossorigin", "anonymous");
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  },
  components: {
    canvasColor,
    canvasBgc,
    canvasFontSize,
  },
};
</script>