import type { ReactionResult } from '@/entities/reaction-result/model'

/** Standard Open Graph size, so the card previews cleanly in chat apps. */
export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

const colors = {
  background: '#0A0A0A',
  surface: '#131316',
  border: '#26262B',
  red: '#E10600',
  white: '#FFFFFF',
  muted: '#8A8A93',
  dim: '#5A5A63',
  best: '#B14EFF',
}

const SANS = 'Montserrat, Arial, sans-serif'
const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'

const font = (weight: number, size: number, family: string) =>
  `${weight} ${size}px ${family}`

/** Left edge of the card's content. */
const LEFT = 80
/** Right edge of the card's content. */
const RIGHT = CARD_WIDTH - 80

/**
 * Makes sure Montserrat is loaded before drawing — a canvas does not wait for
 * web fonts and would silently fall back to Arial.
 */
const fontsReady = async () => {
  if (!('fonts' in document)) return

  try {
    await Promise.all([
      document.fonts.load(font(800, 64, SANS)),
      document.fonts.load(font(600, 20, SANS)),
    ])
    await document.fonts.ready
  } catch {
    // Fall back to Arial rather than not drawing at all.
  }
}

const spaced = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) => {
  ctx.letterSpacing = `${spacing}px`
  ctx.fillText(text, x, y)
  ctx.letterSpacing = '0px'
}

const drawFrame = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = colors.background
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // 1px inset border; the half-pixel offset keeps the line crisp.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(24.5, 24.5, CARD_WIDTH - 49, CARD_HEIGHT - 49)

  ctx.fillStyle = colors.red
  ctx.fillRect(24, 24, 6, 120)
}

const drawHeader = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = colors.red
  ctx.font = font(800, 20, SANS)
  spaced(ctx, 'F1UZ · FUN ZONE', LEFT, 110, 3)

  ctx.fillStyle = colors.white
  ctx.font = font(800, 60, SANS)
  spaced(ctx, 'Reaction Test', LEFT, 178, -1)

  // Two rows of alternating red/white dashes, like a chequered flag strip.
  const cell = { width: 18, height: 6 }

  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 12; column++) {
      ctx.fillStyle = (row + column) % 2 ? colors.white : colors.red
      ctx.fillRect(
        LEFT + column * cell.width,
        204 + row * cell.height,
        cell.width,
        cell.height,
      )
    }
  }
}

const drawAverage = (ctx: CanvasRenderingContext2D, result: ReactionResult) => {
  ctx.fillStyle = colors.muted
  ctx.font = font(600, 18, SANS)
  spaced(ctx, 'AVERAGE', LEFT, 290, 3)

  const value = String(result.average)
  ctx.fillStyle = colors.white
  ctx.font = font(700, 150, MONO)
  spaced(ctx, value, LEFT - 6, 430, -4)
  const width = ctx.measureText(value).width - 4 * value.length

  ctx.fillStyle = colors.muted
  ctx.font = font(500, 40, MONO)
  ctx.fillText('ms', LEFT + width + 8, 430)

  ctx.fillStyle = result.gradeColor
  ctx.font = font(800, 30, SANS)
  spaced(ctx, result.grade.toUpperCase(), LEFT, 486, 3)

  ctx.fillStyle = colors.dim
  ctx.font = font(600, 16, SANS)
  spaced(ctx, 'BEST LAUNCH', LEFT, 532, 2.5)
  const labelWidth = ctx.measureText('BEST LAUNCH').width + 2.5 * 11

  ctx.fillStyle = colors.white
  ctx.font = font(700, 20, MONO)
  ctx.fillText(`${result.best} ms`, LEFT + labelWidth + 14, 532)
}

const drawGantry = (ctx: CanvasRenderingContext2D) => {
  const radius = 14
  const gap = 14
  const x = RIGHT - 5 * radius * 2 - 4 * gap

  ctx.shadowColor = '#FF2A2A73'
  ctx.shadowBlur = 20
  ctx.fillStyle = '#FF2A2A'

  for (let light = 0; light < 5; light++) {
    ctx.beginPath()
    ctx.arc(x + radius + light * (radius * 2 + gap), 100, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
}

const drawLaunches = (ctx: CanvasRenderingContext2D, result: ReactionResult) => {
  const gap = 12
  const width = 90
  const height = 104
  const top = 300
  const left = RIGHT - result.launches.length * (width + gap) + gap

  ctx.fillStyle = colors.muted
  ctx.font = font(600, 16, SANS)
  spaced(ctx, 'LAUNCHES', left, top - 22, 3)

  ctx.textAlign = 'center'

  result.launches.forEach((time, index) => {
    const x = left + index * (width + gap)

    ctx.fillStyle = colors.surface
    ctx.fillRect(x, top, width, height)
    ctx.strokeStyle = colors.border
    ctx.strokeRect(x + 0.5, top + 0.5, width - 1, height - 1)

    ctx.fillStyle = time === result.best ? colors.best : colors.white
    ctx.font = font(700, 30, MONO)
    ctx.fillText(String(time), x + width / 2, top + 56)

    ctx.fillStyle = colors.muted
    ctx.font = font(700, 14, SANS)
    ctx.fillText(`L${index + 1}`, x + width / 2, top + 84)
  })

  ctx.textAlign = 'left'
}

const drawFooter = (ctx: CanvasRenderingContext2D, siteUrl: string) => {
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.muted
  ctx.font = font(500, 20, MONO)
  ctx.fillText(siteUrl, RIGHT, 532)
  ctx.textAlign = 'left'
}

/**
 * Draws the 1200×630 share card for a finished test.
 * @param siteUrl Shown in the corner, e.g. `f1uz.com/reaction-time-test`.
 * @returns The card as a PNG, or null if the browser cannot draw it.
 */
export const drawShareCard = async (
  result: ReactionResult,
  siteUrl: string,
): Promise<Blob | null> => {
  await fontsReady()

  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT

  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  ctx.textBaseline = 'alphabetic'
  drawFrame(ctx)
  drawHeader(ctx)
  drawAverage(ctx, result)
  drawGantry(ctx)
  drawLaunches(ctx, result)
  drawFooter(ctx, siteUrl)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}
