<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'green' | 'red' | 'yellow' | 'gray'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    dot?: boolean
  }>(),
  {
    variant: 'green',
    size: 'md',
    dot: true,
  },
)

const variants: Record<Variant, { wrapper: string; dot: string }> = {
  green: { wrapper: 'bg-[#16261B] text-[#3FA35C]', dot: 'bg-[#3FA35C]' },
  red: { wrapper: 'bg-[#2F1412] text-[#C13B33]', dot: 'bg-[#C13B33]' },
  yellow: { wrapper: 'bg-[#332915] text-[#D9A441]', dot: 'bg-[#D9A441]' },
  gray: { wrapper: 'bg-[#232326] text-[#9C9CA1]', dot: 'bg-[#9C9CA1]' },
}

const sizes: Record<Size, string> = {
  sm: 'px-[10px] py-1 text-[10px]',
  md: 'px-[10px] py-[5px] text-[11px]',
}

const style = computed(() => variants[props.variant])
</script>

<template>
  <span
    class="flex w-fit items-center gap-[6px] font-bold tracking-[0.6px] whitespace-nowrap"
    :class="[sizes[props.size], style.wrapper]"
  >
    <span v-if="props.dot" class="h-[6px] w-[6px] rounded-full" :class="style.dot"></span>
    <slot />
  </span>
</template>
