<template>
  <div>Home</div>
  <Button type="primary"><router-link to="/login">退出</router-link></Button>
</template>

<script lang="ts">
  import { Button } from 'ant-design-vue';

  export default {
    name: 'Home',
    components: { Button },
  };
</script>
