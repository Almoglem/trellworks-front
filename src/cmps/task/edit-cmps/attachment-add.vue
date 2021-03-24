<template>
  <section class="task-attachment">
    <h3 class="pop-up-title">Attach a link via</h3>
    <label class="file-upload" for="file-upload"> Computer </label>
    <input
      type="file"
      id="file-upload"
      @change="addFilePc"
      :style="{ display: 'none' }"
    />
    <label class="link-upload"> Link </label>
    <input
      type="text"
      class="pop-up-input"
      placeholder="Paste any url here..."
      @paste="addFileUrl"
      v-model="urlToUpload"
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
  data() {
    return {
      taskToEdit: JSON.parse(JSON.stringify(this.task)),
      urlToUpload: "",
    };
  },
  methods: {
    async addFilePc(ev) {
      try {
        this.$emit("toggleLoader", true);
        const imgUploaded = await uploadImg(ev);
        const img = {
          id: utilService.makeId(),
          src: imgUploaded.url,
          name: `${imgUploaded.original_filename}.${imgUploaded.format}`,
          createdAt: Date.now(),
        };
        if (!this.taskToEdit.cover.src) {
          this.taskToEdit.cover.src = img.src;
          this.taskToEdit.cover.type = "top";
          this.taskToEdit.cover.isImg = true;
        }
        this.taskToEdit.imgs.unshift(img);
        this.$emit("updateTask", this.taskToEdit);
        this.$emit("close");
        this.$emit("toggleLoader", false);
        this.$emit(
          "logActivity",
          `added an attachment to "${this.taskToEdit.title}"`
        );
      } catch (err) {
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
    },
    addFileUrl() {
      try {
        setTimeout(() => {
          if (!this.urlToUpload.includes("http"))
            return console.log("not a valid link");
          const img = {
            id: utilService.makeId(),
            src: this.urlToUpload,
            name: `Your Image`,
            createdAt: Date.now(),
          };
          if (!this.taskToEdit.cover.src) {
            this.taskToEdit.src = img.src;
            this.taskToEdit.type = "top";
            this.taskToEdit.isImg = true;
          }
          this.taskToEdit.imgs.unshift(img);
          this.$emit("updateTask", this.taskToEdit);
          this.$emit("close");
          this.$emit(
            "logActivity",
            `added an attachment to "${this.taskToEdit.title}"`
          );
        }, 200);
      } catch (err) {
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
    },
  },
};
</script>
