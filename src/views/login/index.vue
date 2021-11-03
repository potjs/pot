<template>
  <div>Login</div>
  <Button type="primary"><router-link to="/">登录</router-link></Button>
</template>

<script lang="ts">
  import { Button } from 'ant-design-vue';

  export default {
    name: 'Home',
    components: { Button },
  };
</script>
