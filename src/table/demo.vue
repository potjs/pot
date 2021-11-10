<template>
  <div class="pot-table">
    <pot-table :width="800" />
  </div>
</template>

<script>
  import { PotTable } from '@potjs/vue-table';
  import { defineComponent } from 'vue';

  import { Divider, Slider, Switch } from 'ant-design-vue';

  export default defineComponent({
    components: { PotTable, Divider, Slider, Switch },
    setup() {},
  });
</script>

<style>
  body,
  html {
    padding: 0;
    margin: 0;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh;
    width: 100vw;
  }

  .pot-table {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
</style>
