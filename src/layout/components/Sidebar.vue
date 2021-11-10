<template>
  <PotMenu
    :active="$route.path"
    :options="permissionRoutes"
    :collapsed="collapsed"
    index-key="path"
    theme="dark"
    @click="handleMenuClick"
  >
    <template #item="{ item }">
      <ItemIcon>😊</ItemIcon>
      <ItemLabel>{{ item.meta.title }}</ItemLabel>
    </template>
  </PotMenu>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { PotMenu } from '@potjs/vue-layout';

  export default defineComponent({
    name: 'LayoutSidebar',
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

      return {
        permissionRoutes,
        handleMenuClick,
      };
    },
    components: {
      PotMenu,
      ItemIcon: PotMenu.ItemIcon,
      ItemLabel: PotMenu.ItemLabel,
    },
  });
</script>
