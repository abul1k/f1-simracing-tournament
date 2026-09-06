<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

type Variant = 'filled' | 'outlined'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    full?: boolean
    disabled?: boolean
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'filled',
    size: 'md',
    full: false,
    disabled: false,
    type: 'button',
  },
)

const variants: Record<Variant, { base: string; disabled: string }> = {
  filled: {
    base: 'bg-[#C13B33] text-white hover:bg-[#A8322B]',
    disabled: 'bg-[#2A2A2E] text-[#68686D]',
  },
  outlined: {
    base: 'border border-[#38383C] text-[#F4F4F2] hover:border-[#F4F4F2]',
    disabled: 'border border-[#2A2A2E] text-[#68686D]',
  },
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-1.75',
  md: 'px-[18px] py-[10px]',
  lg: 'px-5 py-3',
}

const classes = computed(() => [
  props.full ? 'w-full' : 'w-fit',
  sizes[props.size],
  props.disabled ? variants[props.variant].disabled : variants[props.variant].base,
])
</script>

<template>
  <component
    :is="props.to ? RouterLink : 'button'"
    :to="props.to"
    :type="props.to ? undefined : props.type"
    :disabled="props.to ? undefined : props.disabled"
    class="flex items-center justify-center text-[12px] font-bold tracking-[0.5px] whitespace-nowrap transition-colors disabled:cursor-not-allowed"
    :class="classes"
  >
    <slot />
  </component>
</template>
