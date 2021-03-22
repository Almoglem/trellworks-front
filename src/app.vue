<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
import appHeader from './cmps/app-header'
export default {
  components: {
    appHeader
  }
}
</script>

