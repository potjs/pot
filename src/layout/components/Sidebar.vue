<template>
  <Menu mode="inline" theme="dark" :inline-collapsed="collapsed" @click="handleMenuClick">
    <template v-for="item in permissionRoutes" :key="item.path">
      <template v-if="!item.children">
        <MenuItem :key="item.path">
          <template #icon>
            <PieChartOutlined />
          </template>
          {{ item.meta.title }}
        </MenuItem>
      </template>
      <template v-else>
        <MySubMenu :menu-info="item" :key="item.path" />
      </template>
    </template>
  </Menu>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { PieChartOutlined } from '@ant-design/icons-vue';
  import { Menu, MenuItem } from 'ant-design-vue';
  import MySubMenu from '/@/layout/components/MySubMenu.vue';

  export default defineComponent({
    name: 'LayoutSidebar',
    setup() {
      const store = useStore();
      const router = useRouter();
      const collapsed = ref<boolean>(false);
      const permissionRoutes = computed(() => store.getters.permission_routes);

      const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
      };

      const handleMenuClick = (e) => {
        router.push(e.key);
      };

      return {
        collapsed,
        toggleCollapsed,
        permissionRoutes,
        handleMenuClick,
      };
    },
    components: {
      MySubMenu,
      PieChartOutlined,
      Menu,
      MenuItem,
    },
  });
</script>
