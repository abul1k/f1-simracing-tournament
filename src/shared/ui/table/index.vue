<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableField } from './types'

const props = withDefaults(
  defineProps<{
    fields: TableField[]
    items: T[]
    rowKey?: string
    minWidth?: string
    rowPadding?: string
    bordered?: boolean
    hideHead?: boolean
    hover?: boolean
    emptyText?: string
  }>(),
  {
    rowKey: 'id',
    minWidth: '760px',
    rowPadding: 'px-5 py-[11px]',
    bordered: true,
    hideHead: false,
    hover: true,
    emptyText: 'No data',
  },
)

defineEmits<{
  rowClick: [item: T, index: number]
}>()

const aligns = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const value = (item: T, key: string) =>
  key.split('.').reduce<any>((acc, part) => acc?.[part], item)

const cellStyle = (field: TableField) => ({
  width: field.width,
  flex: field.width ? '0 0 auto' : '1 1 0',
})

const cellClass = (field: TableField) => [
  aligns[field.align ?? 'left'],
  field.class ?? 'text-[12px] font-normal text-[#9C9CA1]',
]

const key = (item: T, index: number) => value(item, props.rowKey) ?? index
</script>

<template>
  <div
    class="w-full overflow-x-auto"
    :class="props.bordered && 'border border-[#2A2A2E] bg-[#141416]'"
  >
    <div :style="{ minWidth: props.minWidth }">
      <div
        v-if="!props.hideHead"
        class="flex border-b border-[#2A2A2E] px-5 py-3"
      >
        <div
          v-for="field in props.fields"
          :key="field.key"
          class="min-w-0 text-[12px] font-bold tracking-[0.6px] text-[#68686D]"
          :class="[aligns[field.align ?? 'left'], field.headClass]"
          :style="cellStyle(field)"
        >
          <slot :name="`head(${field.key})`" :field="field">
            {{ field.label ?? field.key }}
          </slot>
        </div>
      </div>

      <div
        v-if="!props.items.length"
        class="px-5 py-8 text-center text-[12px] text-[#68686D]"
      >
        <slot name="empty">{{ props.emptyText }}</slot>
      </div>

      <div
        v-for="(item, index) in props.items"
        v-else
        :key="key(item, index)"
        class="flex items-center transition-colors"
        :class="[
          props.rowPadding,
          index > 0 && 'border-t border-[#2A2A2E]',
          props.hover && 'hover:bg-[#1A1A1D]',
        ]"
        @click="$emit('rowClick', item, index)"
      >
        <div
          v-for="field in props.fields"
          :key="field.key"
          class="min-w-0"
          :class="cellClass(field)"
          :style="cellStyle(field)"
        >
          <slot
            :name="`cell(${field.key})`"
            :item="item"
            :value="value(item, field.key)"
            :index="index"
            :field="field"
          >
            {{ value(item, field.key) }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
