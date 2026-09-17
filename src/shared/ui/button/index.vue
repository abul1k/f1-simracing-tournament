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
    /** External URL — renders a link that opens in a new tab. */
    href?: string
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
    base: 'bg-racing-red text-white hover:bg-[#A8322B]',
    disabled: 'bg-[#2A2A2E] text-[#68686D]',
  },
  outlined: {
    base: 'border border-still-gray text-[#F4F4F2] hover:border-silver',
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
  props.disabled
    ? variants[props.variant].disabled
    : variants[props.variant].base,
])
</script>

<template>
  <a
    v-if="props.href"
    :href="props.href"
    target="_blank"
    rel="noopener noreferrer"
    class="cursor-pointer flex items-center justify-center text-[12px] font-bold tracking-[0.5px] whitespace-nowrap transition-colors"
    :class="classes"
  >
    <slot />
  </a>
  <component
    v-else
    :is="props.to ? RouterLink : 'button'"
    :to="props.to"
    :type="props.to ? undefined : props.type"
    :disabled="props.to ? undefined : props.disabled"
    class="cursor-pointer flex items-center justify-center text-[12px] font-bold tracking-[0.5px] whitespace-nowrap transition-colors disabled:cursor-not-allowed"
    :class="classes"
  >
    <slot />
  </component>
</template>
