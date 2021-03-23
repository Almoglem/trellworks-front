<template>
  <section class="task-cover-picker">
    <h3 class="pop-up-title">size</h3>
    <div class="cover-type">
      <div class="cover-top" :class="selectedTypeTop" @click="setCoverType('top')">
        <div class="color" :style="{background: coverToShow}"></div>
        <div class="line-preview">
          <div class="row1"></div>
          <div class="row2"></div>
          <div class="row3">
            <div class="a"></div>
            <div class="a"></div>
          </div>
          <div class="dot"></div>
        </div>
      </div>
      <div class="cover-full" :class="selectedTypeFull" :style="{background: coverToShow}" @click="setCoverType('full')">
        <div class="line-preview">
          <div class="row1"></div>
          <div class="row2"></div>
        </div>
      </div>
    </div>
    <h3 class="pop-up-title">colors</h3>
    <div class="colors">
      <div class="color-picker" v-for="color in allColors"
      :class="{'active-top': taskToEdit.cover.src === color.color}"
      :style="{backgroundColor: color.color}" :key="color.color"
      @click.self="selectCoverByColor(color.color)"></div>
    </div>
  </section>
</template>


<script>
import {boardService} from '@/services/board.service.js'
export default {
  props: {
    task: Object
  },
  data(){
    return {
      allColors: boardService.getAllColors(),
      coverSelected: null
    }
  },
  computed: {
    taskToEdit(){
      return JSON.parse(JSON.stringify(this.task))
    },
    coverToShow(){
      if(!this.taskToEdit.cover.src || this.taskToEdit.isImg) return '#d9d9da'
      else if(this.taskToEdit.cover.src && !this.taskToEdit.cover.isImg) return this.taskToEdit.cover.src
      else return '#d9d9da'
    },
    selectedTypeTop(){
      return {'active-top': this.taskToEdit.cover.type === 'top'}
    },
    selectedTypeFull(){
      return {'active-full': this.taskToEdit.cover.type === 'full'}
    },
  },
  methods: {
    setCoverType(type){
      if(!this.taskToEdit.cover.src) return console.log('cant');
      this.taskToEdit.cover.type = type;
      this.$emit('updateTask', this.taskToEdit)
    },
    selectCoverByColor(color){
      this.taskToEdit.cover.isImg = false;
      if(this.taskToEdit.cover.src === color) {
        this.taskToEdit.cover.src = '';
        this.taskToEdit.cover.type = 'top'
        return this.$emit('updateTask', this.taskToEdit)
      }
      this.taskToEdit.cover.src = color;
      this.coverSelected = this.taskToEdit.cover;
      this.$emit('updateTask', this.taskToEdit)
    }
  },
  created(){
    this.coverSelected = this.taskToEdit.cover || null
  }
}
</script>
