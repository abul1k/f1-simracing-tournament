<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DriverProfileWidget from '@/widgets/drivers/profile.vue'
import { useProfileHeader } from '@/features/driver-profile/model'
import { toSlug } from '@/shared/utils/slug'

const route = useRoute()

const slug = computed(() => String(route.params.driver))

const driver = useProfileHeader(slug, toSlug)
</script>

<template>
  <DriverProfileWidget :driver="driver" />
</template>
