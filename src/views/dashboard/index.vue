<template>
  <div class="tmp-container">
    <div v-for="i in 50" :key="i">
      <Popper
        class="demo-popper"
        trigger="hover"
        :placement="placements[i % placements.length]"
        :append-to-body="true"
        :show-arrow="'demo-arrow'"
        :show-after="200"
        transition="fade"
      >
        <Button type="primary" style="margin-bottom: 20px; width: 120px">
          {{ placements[i % placements.length] }}
        </Button>
        <template #content><span>Hello world</span></template>
      </Popper>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Popper from '@potjs/vue-popper';
  import { Button } from 'ant-design-vue';
  import { ref } from 'vue';

  const placements = ref([
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
  ]);
</script>

<style lang="less">
  .tmp-container {
    background: #fff;
  }

  .demo-popper {
    padding: 10px;
    background: #000;
    border-radius: 3px;
    color: #fff;
    z-index: 99999;

    &[data-popper-placement^='top'] > .demo-arrow {
      bottom: -4px;
    }

    &[data-popper-placement^='bottom'] > .demo-arrow {
      top: -4px;
    }

    &[data-popper-placement^='left'] > .demo-arrow {
      right: -4px;
    }

    &[data-popper-placement^='right'] > .demo-arrow {
      left: -4px;
    }
  }

  .demo-arrow,
  .demo-arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  .demo-arrow {
    visibility: hidden;
  }

  .demo-arrow::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
