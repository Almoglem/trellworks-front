<template>
  <section class="attachments-preview">
    <i class="fas fa-paperclip"></i>
    <h1 class="details-title">Attachments</h1>
    <section class="attachments-thumbnail">
      <div class="image-preview" v-for="img in task.imgs" :key="img.id">
        <div class="image-cover clickable" @click="test(img)">
          <img v-if="!img.isNote" @click="showImage(true, img)" class="img" :src="img.src" />
          <img v-else :src="`data:image/png;base64,${img.src}`" alt=""/>
        </div>
        
        <div class="image-details">
          <p class="image-name">{{ img.name }}</p>
          <small
            >Added {{ attachmentTimestamp(img.createdAt) }} -
            <span class="image-info" @click="removeImg(img)">Delete</span> -
            <span class="image-info" @click.stop="renderCanvas(img, $event)">Edit</span> - 
            <span @click="toggleEdit(true, img)" class="image-info"
              >Rename
            </span>
          </small>
          <small class="image-info cover-maker" @click="setCover(img)">{{
            task.cover.src === img.src ? "Remove cover" : "Make cover"
          }}</small>
        </div>
      </div>
      <div class="edit-window pop-up-header" v-if="editToggler">
        <i class="fas fa-times clickable" @click="editToggler = false"> </i>
        <h3>Rename</h3>
        <hr />
        <h3 class="edit-window-title">Link Name</h3>
        <input type="text" class="pop-up-input" v-model="txtToEdit" />
        <button class="btn-success" @click="editImg">Update</button>
      </div>
      <section class="image-window" v-if="currImg" @click="showImage(false)">
        <div>
          <img :src="currImg.src" alt="" />
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import moment from "moment";

export default {
  props: {
    task: Object,
  },
  data() {
    return {
      taskToEdit: JSON.parse(JSON.stringify(this.task)),
      imgToEdit: null,
      txtToEdit: "",
      editToggler: false,
      currImg: null,
    };
  },
  computed: {},
  methods: {
    test(img){
      console.log(img);
    },
    editImg() {
      this.imgToEdit.name = this.txtToEdit;
      this.editToggler = false;
      this.$emit("editImg", this.imgToEdit);
      this.$emit(
        "logActivity",
        `changed an attachment in "${this.taskToEdit.title}"`
      );
    },
    removeImg(img) {
      this.$emit("removeImg", img);
      this.$emit(
        "logActivity",
        `removed an attachment from "${this.taskToEdit.title}"`
      );
    },
    toggleEdit(toggler, img) {
      this.editToggler = toggler;
      this.imgToEdit = img;
      this.txtToEdit = img.name;
    },
    showImage(toggler, img) {
      if (!toggler) this.currImg = null;
      this.currImg = img;
    },
    setCover(img) {
      if (img.src === this.task.cover.src) {
        return this.$emit("setCover", false, "");
      }
      this.$emit("setCover", true, img);
    },
    renderCanvas(img, ev){
      this.$emit('renderCanvas', img, ev)
    },
    moment: function () {
      return moment();
    },
    attachmentTimestamp(time) {
      return moment(time).fromNow();
    },
  },
  created() {},
};
</script>
