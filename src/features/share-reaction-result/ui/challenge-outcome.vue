<script setup lang="ts">
import { computed } from 'vue'
import { useChallenge } from '../model'

const props = defineProps<{
  /** The viewer's average for the test just finished, in ms. */
  average: number
}>()

const challenge = useChallenge()

const beaten = computed(
  () => challenge.value !== null && props.average < challenge.value,
)
</script>

<template>
  <p
    v-if="beaten"
    class="text-[12px] font-extrabold tracking-[1.8px] text-[#00A83E] uppercase"
    role="status"
  >
    You beat the challenge!
  </p>
</template>
