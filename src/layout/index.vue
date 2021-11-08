<template>
  <PotLayout footer trigger="top" :header-mix="false">
    <template #default><LayoutPage /></template>

    <template #header><LayoutHeader /></template>

    <template #action>
      <BellOutlined :style="{ fontSize: '16px', padding: '8px' }" />
      <FullscreenOutlined :style="{ fontSize: '16px', padding: '8px' }" />
    </template>

    <template #footer><LayoutFooter /></template>

    <template #sidebar="{ collapsed }"><LayoutSidebar :collapsed="collapsed.value" /></template>

    <template #logo>Logo Slot</template>
  </PotLayout>
</template>

<script lang="ts">
  import { PotLayout } from '@potjs/vue-layout';
  import { LayoutHeader, LayoutFooter, LayoutSidebar, LayoutPage } from './components';
  import { BellOutlined, FullscreenOutlined } from '@ant-design/icons-vue';

  export default {
    name: 'DefaultLayout',
    components: {
      PotLayout,
      LayoutHeader,
      LayoutFooter,
      LayoutSidebar,
      LayoutPage,
      BellOutlined,
      FullscreenOutlined,
    },
  };
</script>
