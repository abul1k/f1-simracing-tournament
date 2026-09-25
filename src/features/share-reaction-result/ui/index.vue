<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { ReactionResult } from '@/entities/reaction-result/model'
import { useShareResult } from '../model'

const props = defineProps<{
  result: ReactionResult
}>()

const {
  isMenuOpen,
  copied,
  share,
  closeMenu,
  shareToTelegram,
  shareToX,
  copyLink,
  downloadImage,
} = useShareResult(() => props.result)

const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()

const menuId = 'share-result-menu'

const items = () =>
  Array.from(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

const focusItem = (index: number) => {
  const all = items()

  all[(index + all.length) % all.length]?.focus()
}

/** Closes the menu and hands focus back to the share button. */
const dismiss = () => {
  closeMenu()
  trigger.value?.focus()
}

const onMenuKeydown = (event: KeyboardEvent) => {
  const current = items().indexOf(document.activeElement as HTMLElement)

  switch (event.key) {
    case 'ArrowDown':
      focusItem(current + 1)
      break
    case 'ArrowUp':
      focusItem(current - 1)
      break
    case 'Home':
      focusItem(0)
      break
    case 'End':
      focusItem(-1)
      break
    case 'Escape':
      dismiss()
      break
    case 'Tab':
      closeMenu()
      return
    default:
      return
  }

  event.preventDefault()
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!root.value?.contains(event.target as Node)) closeMenu()
}

watch(isMenuOpen, async (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    await nextTick()
    focusItem(0)
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      ref="trigger"
      type="button"
      class="cursor-pointer rounded-[2px] border border-[#3A3A41] px-7 py-3.5 text-[13px] font-extrabold tracking-[1.4px] text-white transition-colors hover:border-silver"
      aria-haspopup="menu"
      :aria-expanded="isMenuOpen"
      :aria-controls="menuId"
      @click="share"
      @keydown.down.prevent="isMenuOpen ? focusItem(0) : share()"
    >
      SHARE RESULT
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      leave-active-class="transition duration-100 ease-in"
      enter-from-class="-translate-y-1 opacity-0"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <div
        v-if="isMenuOpen"
        :id="menuId"
        ref="menu"
        role="menu"
        aria-label="Share result"
        class="absolute top-full right-0 z-20 mt-2 flex w-[210px] flex-col border border-[#38383C] bg-[#141416] py-1.5 text-left shadow-[0_12px_32px_#000000B3]"
        @keydown="onMenuKeydown"
      >
        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-[#9C9CA1] outline-none transition-colors hover:bg-[#1C1C20] hover:text-[#F4F4F2] focus-visible:bg-[#1C1C20] focus-visible:text-[#F4F4F2]"
          @click="shareToTelegram"
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
          Telegram
        </button>

        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-[#9C9CA1] outline-none transition-colors hover:bg-[#1C1C20] hover:text-[#F4F4F2] focus-visible:bg-[#1C1C20] focus-visible:text-[#F4F4F2]"
          @click="shareToX"
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z"
            />
          </svg>
          X
        </button>

        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-[12px] font-semibold tracking-[0.5px] outline-none transition-colors hover:bg-[#1C1C20] focus-visible:bg-[#1C1C20]"
          :class="
            copied
              ? 'text-[#00A83E]'
              : 'text-[#9C9CA1] hover:text-[#F4F4F2] focus-visible:text-[#F4F4F2]'
          "
          @click="copyLink"
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path v-if="copied" d="M20 6 9 17l-5-5" />
            <template v-else>
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              />
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              />
            </template>
          </svg>
          <span aria-live="polite">{{ copied ? 'Copied!' : 'Copy link' }}</span>
        </button>

        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-[12px] font-semibold tracking-[0.5px] text-[#9C9CA1] outline-none transition-colors hover:bg-[#1C1C20] hover:text-[#F4F4F2] focus-visible:bg-[#1C1C20] focus-visible:text-[#F4F4F2]"
          @click="downloadImage"
        >
          <svg
            class="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 10 5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          Download image
        </button>
      </div>
    </Transition>
  </div>
</template>
