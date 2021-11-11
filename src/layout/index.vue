<template>
  <PotLayout footer trigger="top" :header-mix="false">
    <template #default><router-view /></template>

    <template #header><LayoutHeader /></template>

    <template #action>
      <BellOutlined :style="{ fontSize: '16px', padding: '8px' }" />
      <FullscreenOutlined :style="{ fontSize: '16px', padding: '8px' }" />
    </template>

    <template #footer><LayoutFooter /></template>

    <template #sidebar="{ collapsed }"><LayoutSidebar :collapsed="collapsed.value" /></template>

    <template #logo>Logo Slot</template>
    <!--<template #trigger>Trigger</template>-->
  </PotLayout>
</template>

<script lang="ts">
  import { PotLayout } from '@potjs/vue-layout';
  import { LayoutHeader, LayoutFooter, LayoutSidebar } from './components';
  import { BellOutlined, FullscreenOutlined } from '@ant-design/icons-vue';

  export default {
    name: 'DefaultLayout',
    components: {
      PotLayout,
      LayoutHeader,
      LayoutFooter,
      LayoutSidebar,
      BellOutlined,
      FullscreenOutlined,
    },
  };
</script>
