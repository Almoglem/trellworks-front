<template>
  <section class="task-labels" v-if="!labelEditToggler.isOpen">
    <input type="text" class="pop-up-input" v-model="filterTxt" @input="filterLabels"  placeholder="Search labels..." />
    <h3 class="pop-up-title">Labels</h3>
    <ul class="labels-list">
      <li
        v-for="label in labels"
        :key="label.id"
        class="label"
        :style="{ backgroundColor: label.color }"
        @click="addLabel(label.id)"
      >
        {{ label.title }}
        <i v-if="isLabelSet(label.id)" class="fas fa-check"></i>
        <i @click.stop="setEditToggler(true, label)" class="fas fa-pencil-alt edit-pen"></i>
      </li>
    </ul>
    <button @click="setEditToggler(true)">Create a new label</button>
  </section>
  <section class="label-edit" v-else>
    <i @click="setEditToggler(false)" class="fas fa-angle-left"></i>
    <h5>Name</h5>
    <input type="text" v-model="newLabel.title" class="pop-up-input" />
    <h5>Select a color</h5>
    <div class="colors">
      <div v-for="color in colorsToAdd" 
      :style="{backgroundColor: color.color}" 
      :key="color.color" 
      class="color-picker"
      @click="setColor(color)"
      ></div>
    </div>
    <div class="label-buttons">
      <button @click="addLabelToBoard" class="btn-success">{{btnSuccessTxtToShow}}</button>
      <button v-if="labelEditToggler.type === 'edit'" class="btn-danger" @click="removeLabelFromBoard">Delete</button>
    </div>
  </section>
</template>

<script>
import {utilService} from '@/services/util.service.js'
import { boardService } from "@/services/board.service.js";
export default {
  props: {
    task: Object
  },
  data() {
    return {
      newLabel: boardService.getEmptyLabel(),
      labelEditToggler: {
        type: '',
        isOpen: false
      },
      colorsToAdd: boardService.getAllColors(),
      filterTxt: ''
    };
  },
  computed: {
    currBoard(){
      return JSON.parse(JSON.stringify(this.$store.getters.currBoard))
    },
    currGroup(){
      return this.$store.getters.currGroup
    },
    taskToEdit(){
      return JSON.parse(JSON.stringify(this.task))
    },
    labelIds(){
      return this.taskToEdit.labelIds
    },
    btnSuccessTxtToShow(){
      return this.labelEditToggler.type === 'edit' ? 'Save' : 'Create'
    },
    labels(){
      return this.$store.getters.boardLabelsForShow
    }
  },
  methods: {
    getTask(board, isIdx) {
      const group = board.groups.find(
        (group) => group.id === this.currGroup.id
      );
      let res;
      if (isIdx) res = group.task.findIndex((task) => task.id === this.taskId);
      else res = group.task.find((task) => task.id === this.task.id);
      return res;
    },
    isLabelSet(labelId){
      const label = this.labelIds.find(label => label === labelId)
      if(label) return true
      else return false
    },
    addLabel(labelId) {
      for (let i = 0; i < this.labelIds.length; i++) {
        if (labelId === this.labelIds[i]) {
          const foundIdx = this.labelIds.findIndex(
            (currLabelId) => currLabelId === labelId );
          this.labelIds.splice(foundIdx, 1);
          this.taskToEdit.labelIds = this.labelIds
          return this.$emit('updateTask', this.taskToEdit)
        }
      }
          this.labelIds.push(labelId);
          this.taskToEdit.labelIds = this.labelIds  
          this.$emit('updateTask', this.taskToEdit)
    },
    setEditToggler(toggle, label){
      this.labelEditToggler.isOpen = toggle
      if(label) {
        this.newLabel = JSON.parse(JSON.stringify(label))
        this.labelEditToggler.type = 'edit'
      } else this.labelEditToggler.type = 'add'
    },
    setColor({color, colorName}){
      this.newLabel.color = color
      this.newLabel.colorName = colorName
    },
    async addLabelToBoard(){
      const taskToEdit = this.getTask(this.currBoard)
      if(!this.newLabel.id){
        this.newLabel.id = utilService.makeId()
        this.labelIds.push(this.newLabel.id);
        taskToEdit.labelIds = this.labelIds;
        this.currBoard.labels.push(this.newLabel)
      } else {
        const foundIdx = this.currBoard.labels.findIndex(label => label.id === this.newLabel.id);
        if(foundIdx===-1) return console.log('couldnt find id for board');
        this.currBoard.labels.splice(foundIdx, 1, this.newLabel)
      }
      this.labelEditToggler.isOpen = false;
      await this.$emit('updateBoard', this.currBoard)
      this.newLabel = boardService.getEmptyLabel()
    },
    removeLabelFromBoard(){
      const foundIdx = this.labels.findIndex(label => label.id === this.newLabel.id);
      this.currBoard.labels.splice(foundIdx,1)
      this.labelEditToggler.isOpen = false;
      this.$emit('updateBoard', this.currBoard)
    },
    filterLabels(){
      this.$store.commit({type: 'setLabelsFilter', filterTxt: this.filterTxt})
    }
  },
  created() {
    this.filterTxt = ''
    this.filterLabels()
  },
};
</script>
