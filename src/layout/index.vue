<template>
  <AjsLayout footer trigger="top" header-mix>
    <template #default><LayoutPage /></template>

    <template #header><LayoutHeader /></template>

    <template #action>
      <BellOutlined :style="{ fontSize: '16px', padding: '8px' }" />
      <FullscreenOutlined :style="{ fontSize: '16px', padding: '8px' }" />
    </template>

    <template #footer><LayoutFooter /></template>

    <template #sidebar><LayoutSidebar /></template>

    <template #logo>Logo Slot</template>
  </AjsLayout>
</template>

<script lang="ts">
  import '@potjs/vue-layout/dist/styles/index.css';
  import { AjsLayout } from '@potjs/vue-layout';
  import { LayoutHeader, LayoutFooter, LayoutSidebar, LayoutPage } from './components';
  import { BellOutlined, FullscreenOutlined } from '@ant-design/icons-vue';

  export default {
    name: 'DefaultLayout',
    components: {
      AjsLayout,
      LayoutHeader,
      LayoutFooter,
      LayoutSidebar,
      LayoutPage,
      BellOutlined,
      FullscreenOutlined,
    },
  };
</script>
