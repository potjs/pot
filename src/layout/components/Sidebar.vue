<template>
  <PotMenu
    :active="$route.path"
    :options="permissionRoutes"
    :collapsed="collapsed"
    index-key="path"
    theme="dark"
    @click="handleMenuClick"
    :render-label="renderLabel"
  />
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { PotMenu } from '@potjs/vue-layout';

  export default defineComponent({
    name: 'LayoutSidebar',
    components: {
      PotMenu,
    },
    props: {
      collapsed: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const permissionRoutes = computed(() => store.getters.permission_routes);

      const handleMenuClick = (index) => {
        router.push(index);
      };

      const renderLabel = (item) => item.meta.title;

      return {
        permissionRoutes,
        handleMenuClick,
        renderLabel,
      };
    },
  });
</script>
