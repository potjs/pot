<template>
  <div>404</div>
  <Button type="primary"><router-link to="/">返回首页</router-link></Button>
</template>

<script lang="ts">
  import { Button } from 'ant-design-vue';

  export default {
    name: 'Home',
    components: { Button },
  };
</script>
