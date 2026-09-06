<script setup lang="ts">
import Navbar from '@/widgets/navbar/index.vue'
import Footer from '@/widgets/footer/index.vue'
</script>

<template>
  <div>
    <Navbar />
    <main class="max-w-360 mx-auto">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
