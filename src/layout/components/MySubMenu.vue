<template>
  <SubMenu :key="menuInfo.path">
    <template #icon><MailOutlined /></template>
    <template #title>{{ menuInfo.meta.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.path">
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
  </SubMenu>
</template>

<script lang="ts">
  import { MailOutlined, PieChartOutlined } from '@ant-design/icons-vue';
  import { MenuItem, SubMenu } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'MySubMenu',
    props: {
      menuInfo: {
        type: Object,
        default: () => ({}),
      },
    },
    components: {
      PieChartOutlined,
      MailOutlined,
      SubMenu,
      MenuItem,
    },
  });
</script>
