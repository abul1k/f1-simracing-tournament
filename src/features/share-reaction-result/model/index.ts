import {
  computed,
  onBeforeUnmount,
  ref,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ReactionResult } from '@/entities/reaction-result/model'
import { copyText } from '@/shared/lib/clipboard'
import { downloadBlob } from '@/shared/lib/download'
import { drawShareCard } from './card'

const ROUTE_NAME = 'reaction-time-test'

/** A challenge outside this range is treated as a bad link and ignored. */
const CHALLENGE_MIN = 100
const CHALLENGE_MAX = 2000

/** How long "Copied!" stays on the menu before it closes. */
const COPIED_FOR = 2000

export const shareText = (result: ReactionResult) =>
  [
    '🏁 F1UZ Reaction Test',
    `Average: ${result.average} ms (${result.grade})`,
    `Best launch: ${result.best} ms`,
    'Can you beat me?',
  ].join('\n')

export const cardFileName = (result: ReactionResult) =>
  `f1uz-reaction-${result.average}ms.png`

export const telegramShareUrl = (text: string, url: string) =>
  `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`

export const xShareUrl = (text: string, url: string) =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

/**
 * Reads a `?challenge=` value.
 * @returns The friend's average in ms, or null if missing or out of range.
 */
export const parseChallenge = (value: unknown): number | null => {
  const raw = Array.isArray(value) ? value[0] : value

  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return null

  const ms = Number(raw)

  return ms >= CHALLENGE_MIN && ms <= CHALLENGE_MAX ? ms : null
}

/** The average a friend challenged the viewer to beat, from the page URL. */
export const useChallenge = (): ComputedRef<number | null> => {
  const route = useRoute()

  return computed(() => parseChallenge(route.query.challenge))
}

const isAbort = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError'

const canWebShare = () => typeof navigator.share === 'function'

/**
 * Everything behind the share button: the native share sheet where the
 * browser has one, and the menu of share targets where it does not.
 */
export const useShareResult = (
  source: MaybeRefOrGetter<ReactionResult | null>,
) => {
  const router = useRouter()

  const isMenuOpen = ref(false)
  const copied = ref(false)

  let copiedTimer: ReturnType<typeof setTimeout> | undefined
  // The card is drawn as soon as a result exists rather than on click: the
  // share sheet must open close to the tap, and drawing waits on fonts.
  let card: Promise<Blob | null> = Promise.resolve(null)

  const result = computed(() => toValue(source))

  const url = computed(() => {
    if (!result.value) return ''

    const { href } = router.resolve({
      name: ROUTE_NAME,
      query: { challenge: String(result.value.average) },
    })

    return `${window.location.origin}${href}`
  })

  const text = computed(() => (result.value ? shareText(result.value) : ''))

  watch(
    result,
    (value) => {
      if (!value) return

      const { href } = router.resolve({ name: ROUTE_NAME })

      card = drawShareCard(value, `${window.location.host}${href}`).catch(
        () => null,
      )
    },
    { immediate: true },
  )

  const cardFile = async (): Promise<File | null> => {
    const blob = await card

    if (!blob || !result.value) return null

    return new File([blob], cardFileName(result.value), { type: 'image/png' })
  }

  const openMenu = () => {
    isMenuOpen.value = true
  }

  const closeMenu = () => {
    isMenuOpen.value = false
    copied.value = false
    clearTimeout(copiedTimer)
  }

  /**
   * The share button. Opens the native share sheet — with the card attached
   * where the browser can share files — or the fallback menu.
   */
  const share = async () => {
    if (!result.value) return

    if (!canWebShare()) {
      if (isMenuOpen.value) closeMenu()
      else openMenu()
      return
    }

    const file = await cardFile()
    const withFile =
      file !== null && navigator.canShare?.({ files: [file] }) === true

    try {
      await navigator.share(
        withFile
          ? // Some apps drop `url` when files are attached, so it rides in the text.
            { files: [file], text: `${text.value}\n${url.value}` }
          : { text: text.value, url: url.value },
      )
    } catch (error) {
      if (isAbort(error)) return

      // Refused (e.g. the tap no longer counts as a user gesture) — offer the
      // manual options instead.
      openMenu()
    }
  }

  const openTarget = (target: string) => {
    window.open(target, '_blank', 'noopener,noreferrer')
    closeMenu()
  }

  const shareToTelegram = () => openTarget(telegramShareUrl(text.value, url.value))

  const shareToX = () => openTarget(xShareUrl(text.value, url.value))

  /** Copies the text and link, then closes the menu once "Copied!" has shown. */
  const copyLink = async () => {
    const ok = await copyText(`${text.value}\n${url.value}`)

    if (!ok) {
      closeMenu()
      return
    }

    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(closeMenu, COPIED_FOR)
  }

  const downloadImage = async () => {
    const blob = await card

    if (blob && result.value) downloadBlob(blob, cardFileName(result.value))

    closeMenu()
  }

  onBeforeUnmount(() => clearTimeout(copiedTimer))

  return {
    isMenuOpen,
    copied,
    share,
    closeMenu,
    shareToTelegram,
    shareToX,
    copyLink,
    downloadImage,
  }
}
