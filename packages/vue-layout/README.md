<h1 align="center">
@potjs/vue-layout

<div align="center">

[![npm](https://img.shields.io/npm/v/@potjs/vue-layout.svg)](https://npmjs.com/package/@potjs/vue-layout)
[![downloads](https://img.shields.io/npm/dm/@potjs/vue-layout.svg)](https://npmjs.org/package/@potjs/vue-layout)
[![license](https://img.shields.io/github/license/potjs/pot.svg)](../../LICENSE)
[![node](https://img.shields.io/node/v/@potjs/vue-layout.svg)](https://nodejs.org/en/about/releases/)

</div>
</h1>

**English** | [中文](./README.zh-CN.md)

## Install
```shell
npm install -S @potjs/vue-layout
# or
yarn add @potjs/vue-layout
```

## Quickstart
```vue
<template>
  <PotLayout>
    <template #default>your content</template>
    <template #header>your header</template>
    <template #footer>your footer</template>
  </PotLayout>
</template>

<script setup>
import { PotLayout } from '@potjs/vue-layout';
</script>
```

## API

### Props
| Property              | Description           | Type | Default |
| --------------------- | --------------------- | --- | --- |
| prefixCls | - | 'pot' | - |
| menuTheme | - | dark, light | - |
| menuMode | - | - | - |
| menuData | - | - | - |
| menuIndent | - | - | - |
| menuKey | - | - | - |
| menuActive | - | - | - |
| renderMenuLabel | - | - | - |
| triggerPlacement | - | - | - |

### Events
| Event Name            | Description                                      |
| --------------------- | ------------------------------------------------ |
| menuSelect | - |

### Slots
| Name                  | Description                                      |
| --------------------- | ------------------------------------------------ |
| default | - |
| logo | - |
| header | - |
| footer | - |

