<template>
  <section class="task-attachment">
    <h3 class="pop-up-title">Attach a link via</h3>
    <label class="file-upload" for="file-upload"> Computer </label>
    <input
      type="file"
      id="file-upload"
      @change="addFile($event, false)"
      :style="{ display: 'none' }"
    />
    <label class="link-upload"> Link </label>
    <input
      type="text"
      class="pop-up-input"
      placeholder="Paste any url here..."
      @paste="addFile($event, true)"
    />
  </section>
</template>


<script>
import { utilService } from "@/services/util.service.js";
import { uploadImg } from "@/services/img-upload.service.js";
export default {
  props: {
    task: Object,
  },
  computed: {
    taskToEdit() {
      return JSON.parse(JSON.stringify(this.task));
    },
  },
  methods: {
    async addFile(ev, isUrl) {
      let src;
      if (isUrl) {
        src = ev.clipboardData.getData("Text");
        if (!src.includes("http")) {
          utilService.showErrorMsg("not a valid link");
          return;
        }
      }
      try {
        this.$emit("toggleLoader", true);
        if (!isUrl) {
          const uploadedImg = await uploadImg(ev);
          src = uploadedImg.url;
        }
        const img = {
          id: utilService.makeId(),
          src,
          name: `Your image`,
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
};
</script>
