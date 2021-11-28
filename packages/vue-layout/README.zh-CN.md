<h1 align="center">
@potjs/vue-layout

<div align="center">

[![npm](https://img.shields.io/npm/v/@potjs/vue-layout.svg)](https://npmjs.com/package/@potjs/vue-layout)
[![downloads](https://img.shields.io/npm/dm/@potjs/vue-layout.svg)](https://npmjs.org/package/@potjs/vue-layout)
[![license](https://img.shields.io/github/license/potjs/pot.svg)](../../LICENSE)
[![node](https://img.shields.io/node/v/@potjs/vue-layout.svg)](https://nodejs.org/en/about/releases/)

</div>
</h1>

**中文** | [English](./README.md)

## 安装
```shell
npm install -S @potjs/vue-layout
# 或
yarn add @potjs/vue-layout
```

## 快速开始
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
| 参数                  | 说明           | 类型 | 默认值 |
| --------------------- | --------------------- | --- | --- |
| mode | - | 'pot' | - |
| menuTheme | - | dark, light | - |
| menuMode | - | - | - |
| menuData | - | - | - |
| menuIndent | - | - | - |
| menuKey | - | - | - |
| menuActive | - | - | - |
| renderMenuLabel | - | - | - |
| trigger | - | - | - |

### Events
| 事件名称            | 说明                                      |
| --------------------- | ------------------------------------------------ |
| menuSelect | - |

### Slots
| Name                  | 说明                                      |
| --------------------- | ------------------------------------------------ |
| default | - |
| logo | - |
| header | - |
| footer | - |

