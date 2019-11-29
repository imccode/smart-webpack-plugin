<template>
  <div>
    <div class="aa">{{ text }}</div>
    <img src="./52232719.jpeg" alt="">
    <button @click="handleClick">+11</button>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      text: 123
    }
  },
  methods: {
    handleClick() {
      console.log('123456')
      this.text += 1
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
.aa {
  font-size: 200px;
}
</style>