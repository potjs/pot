<template>
  <PotLayout
    trigger="top"
    :menu-mode="mode"
    :menu-data="permissionRoutes"
    :menu-active="$route.path"
    menu-key="path"
    :render-menu-label="renderMenuLabel"
    @menu-select="handleMenuClick"
  >
    <template #default><router-view /></template>

    <template #header><LayoutHeader /></template>

    <template #action>
      <RadioGroup v-model:value="mode" button-style="solid">
        <RadioButton value="side">Side</RadioButton>
        <RadioButton value="mix-side">MixSide</RadioButton>
        <RadioButton value="mix">Mix</RadioButton>
        <RadioButton value="top">Top</RadioButton>
      </RadioGroup>
      <BellOutlined :style="{ fontSize: '16px', padding: '8px' }" />
      <FullscreenOutlined :style="{ fontSize: '16px', padding: '8px' }" />
    </template>

    <template #footer><LayoutFooter /></template>

    <template #logo>Logo Slot</template>
    <!--<template #trigger>Trigger</template>-->
  </PotLayout>
</template>

<script lang="ts">
  import { computed, ref } from 'vue';
  import { PotLayout } from '@potjs/vue-layout';
  import { LayoutHeader, LayoutFooter } from './components';
  import { BellOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  export default {
    name: 'DefaultLayout',
    components: {
      PotLayout,
      LayoutHeader,
      LayoutFooter,
      BellOutlined,
      FullscreenOutlined,
      RadioGroup,
      RadioButton,
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const permissionRoutes = computed(() => store.getters.permission_routes);
      const mode = ref('mix-side');

      const handleMenuClick = (index) => {
        router.push(index);
      };
      const renderMenuLabel = (item) => item.meta.title;

      return {
        mode,
        permissionRoutes,
        renderMenuLabel,
        handleMenuClick,
      };
    },
  };
</script>
