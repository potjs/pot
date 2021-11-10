<template>
  <div class="tmp-container">
    <div v-for="i in 200" :key="i">{{ i }}</div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less">
  .tmp-container {
    background: #fff;
  }
</style>
