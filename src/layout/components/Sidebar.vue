<template>
  <AjsMenu
    :options="permissionRoutes"
    :collapsed="collapsed"
    index-key="path"
    @click="handleMenuClick"
  >
    <template #item="{ item }">
      <ItemIcon>😊</ItemIcon>
      <ItemLabel>{{ item.meta.title }}</ItemLabel>
    </template>
  </AjsMenu>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { AjsMenu } from '@potjs/vue-layout';

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
        console.log('#handleMenuClick', index);
        router.push(index);
      };

      return {
        permissionRoutes,
        handleMenuClick,
      };
    },
    components: {
      AjsMenu,
      ItemIcon: AjsMenu.ItemIcon,
      ItemLabel: AjsMenu.ItemLabel,
    },
  });
</script>
