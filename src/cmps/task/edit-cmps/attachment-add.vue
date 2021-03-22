<template>
  <section class="task-attachment">
    <h3 class="pop-up-title">Attach a link via</h3>
    <label class="file-upload" for="file-upload">
      Computer
    </label>
    <input type="file" id="file-upload" @change="addFilePc" :style="{display: 'none'}"/>
    <label class="link-upload">
      Link
    </label>
   <input type="text" class="pop-up-input" placeholder="Paste any url here..." @paste="addFileUrl" v-model="urlToUpload">
  </section>
</template>


<script>
import {utilService} from '@/services/util.service.js'
import {uploadImg} from "@/services/img-upload.service.js";
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      taskToEdit: JSON.parse(JSON.stringify(this.task)),
      urlToUpload: ''
    };
  },
  methods: {
    async addFilePc(ev) {
      const imgUploaded = await uploadImg(ev)
      const img = {
        id: utilService.makeId(),
        src: imgUploaded.url,
        name: `${imgUploaded.original_filename}.${imgUploaded.format}`,
        createdAt: Date.now()
      }
      if(this.taskToEdit.imgs.length === 0 && !this.taskToEdit.cover) this.taskToEdit.cover = img.src;
      this.taskToEdit.imgs.unshift(img)
      this.$emit("updateTask", this.taskToEdit);
        this.$emit('logActivity',`added an attachment to "${this.taskToEdit.title}"`)
      this.$emit('close')
    },
    addFileUrl(){
      setTimeout(() => {
        if(!this.urlToUpload.includes('http')) return console.log('not a valid link')
        const img = {
          id: utilService.makeId(),
          src: this.urlToUpload,
          name: `Your Image`,
          createdAt: Date.now()
        }
        if(this.taskToEdit.imgs.length === 0 && !this.taskToEdit.cover) this.taskToEdit.cover = img.src;
        this.taskToEdit.imgs.unshift(img)
        this.$emit('logActivity',`added an attachment to "${this.taskToEdit.title}"`)
        this.$emit("updateTask", this.taskToEdit);
        this.$emit('close')
      }, 200);
    }
  },
  
};
</script>
