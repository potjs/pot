<template>
  <div>Home</div>
  <Button type="primary"><router-link to="/login">退出</router-link></Button>

  <div style="width: 300px">
    <Button type="primary" @click="toggleCollapsed">Collapsed</Button>
    <AjsMenu :options="permissionRoutes" :render-label="renderLabel" :collapsed="collapsed" />
    <AjsMenu :options="list" mode="horizontal" />
  </div>
</template>

<script lang="ts">
  import { Button } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';
  import { AjsMenu } from '@potjs/vue-layout';

  export default {
    name: 'Home',
    components: { Button, AjsMenu },
    setup() {
      const store = useStore();
      const permissionRoutes = computed(() => store.getters.permission_routes);
      const list = [
        {
          key: '1',
          label: 'Option 1',
        },
        {
          key: '2',
          label: 'Navigation 2',
          children: [
            {
              key: '2.1',
              label: 'Navigation 3',
              children: [{ key: '2.1.1', label: 'Option 2.1.1' }],
            },
          ],
        },
      ];

      const renderLabel = (item) => {
        return item.meta.title;
      };

      const collapsed = ref(false);
      const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
      };

      return {
        permissionRoutes,
        list,
        renderLabel,
        collapsed,
        toggleCollapsed,
      };
    },
  };
</script>
