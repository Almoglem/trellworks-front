<template>
  <el-select v-model="value" @change="setColor" placeholder="Black">
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
          value: 'black',
          label: 'Black'
        },{
          value: 'white',
          label: 'White'
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
        setColor(){
            this.$emit('setColor', this.value)
        }
    }
  }
</script>