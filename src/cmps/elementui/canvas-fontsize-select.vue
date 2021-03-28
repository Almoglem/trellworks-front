<template>
  <el-select v-model="value" @change="setPenWidth" placeholder="Set size">
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
          value: 4,
          label: 'Small'
        },{
          value: 7,
          label: 'Medium'
        }, {
          value: 10,
          label: 'Big'
        }
        ],
        value: ''
      }
    },
    methods: {
        setPenWidth(){
            this.$emit('setPenWidth', this.value)
        }
    }
  }
</script>