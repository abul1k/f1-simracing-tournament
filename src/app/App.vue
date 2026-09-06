<script setup lang="ts">
import { useRoute } from 'vue-router'
import MainLayout from '@/widgets/layouts/main.vue'

const layouts: {
  [key: string]: any
} = {
  main: MainLayout,
}

const route = useRoute()
</script>

<template>
  <component :is="layouts[route?.meta?.layout as string]">
    <RouterView />
  </component>
</template>
