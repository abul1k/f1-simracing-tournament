<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DriverProfileWidget from '@/widgets/drivers/profile.vue'
import { defaultDriverStandings } from '@/features/standings/model'
import { defaultRounds } from '@/features/calendar/model'
import { carNumbers } from '@/features/drivers/model'
import { toSlug } from '@/shared/utils/slug'

const route = useRoute()

const driver = computed(() =>
  defaultDriverStandings.find(
    (item) => toSlug(item.driver) === String(route.params.driver),
  ),
)

const number = computed(() => {
  if (!driver.value) return undefined

  return (
    carNumbers[driver.value.driver] ?? carNumbers[driver.value.driver.split(' ')[0]] ?? 0
  )
})
</script>

<template>
  <DriverProfileWidget :driver="driver" :rounds="defaultRounds" :number="number" />
</template>
