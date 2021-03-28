<template>
  <el-select v-model="value" @change="setBgc" placeholder="White">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 'white',
          label: 'White'
        },{
          value: 'black',
          label: 'Black'
        }, {
          value: 'red',
          label: 'Red'
        }, {
          value: 'green',
          label: 'Green'
        }, {
          value: 'blue',
          label: 'Blue'
        }, {
          value: 'brown',
          label: 'Brown'
        }, {
          value: 'purple',
          label: 'Purple'
        }, {
          value: 'yellow',
          label: 'Yellow'
        }
        ],
        value: ''
      }
    },
    methods: {
        setBgc(){
            this.$emit('setBgc', this.value)
        }
    }
  }
</script>