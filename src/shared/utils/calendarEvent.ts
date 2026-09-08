/**
 * Builds and hands over a single-event `.ics` file, which is how a web page adds
 * a date to whatever calendar the visitor actually uses.
 *
 * An `.ics` download is the only approach that works everywhere: iOS, Android,
 * Outlook and the desktop calendar apps all treat the file as "add this event",
 * and none of it requires the visitor to be signed in to a particular provider
 * the way a Google Calendar link would.
 *
 * Times are written as iCalendar *floating* local times — no `Z`, no `TZID`.
 * The site's session times are bare wall-clock strings (`22:30`) with no zone
 * attached, and the countdown already reads them as the visitor's own local
 * time. Stamping a zone here would make the calendar entry disagree with the
 * countdown sitting directly above the button. If the championship ever needs
 * to pin sessions to Tashkent regardless of who is watching, that is a data
 * change — a timezone on the championship — and this file follows it.
 */

export interface CalendarEvent {
  /** Stable identifier for the event, so re-adding it updates rather than duplicates. */
  uid: string
  title: string
  description?: string
  location?: string
  /** Local datetime, `YYYY-MM-DDTHH:mm:ss` — as produced by `sessionStartsAt`. */
  startsAt: string
  /** How long to block out; the schedule gives most sessions no end time. */
  durationMinutes: number
}

const pad = (value: number): string => String(value).padStart(2, '0')

/** `2026-09-07T22:30:00` → `20260907T223000`, the iCalendar date-time form. */
const toStamp = (local: string): string => local.replace(/[-:]/g, '').slice(0, 15)

/** Shifts a local datetime string by whole minutes, staying in local time. */
const addMinutes = (local: string, minutes: number): string => {
  const at = new Date(local)

  at.setMinutes(at.getMinutes() + minutes)

  return (
    `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}` +
    `T${pad(at.getHours())}:${pad(at.getMinutes())}:${pad(at.getSeconds())}`
  )
}

/** The moment the file was generated, which iCalendar wants in UTC. */
const nowStamp = (): string =>
  `${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`

/**
 * Escapes a value for an iCalendar TEXT field. Backslashes, semicolons, commas
 * and newlines are all structural in the format and have to be quoted, or a
 * comma in a race name silently splits the field in two.
 */
const escapeText = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

/**
 * Folds a content line to 75 octets, continuing with a leading space, as
 * RFC 5545 requires. Measured in UTF-8 bytes rather than characters, so a
 * non-ASCII circuit name cannot be split mid-character.
 */
const fold = (line: string): string => {
  const bytes = new TextEncoder().encode(line)

  if (bytes.length <= 75) return line

  const decoder = new TextDecoder()
  const chunks: string[] = []

  let offset = 0

  while (offset < bytes.length) {
    // 75 on the first line, then 74 to leave room for the leading space.
    const limit = offset === 0 ? 75 : 74

    let size = Math.min(limit, bytes.length - offset)

    // Never cut inside a multi-byte character: 0b10xxxxxx is a continuation.
    while (size > 1 && (bytes[offset + size] & 0b1100_0000) === 0b1000_0000) {
      size -= 1
    }

    chunks.push(decoder.decode(bytes.slice(offset, offset + size)))
    offset += size
  }

  return chunks.join('\r\n ')
}

/** Serialises one event as a complete iCalendar document. */
export const buildCalendarEvent = (event: CalendarEvent): string => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//F1 Uzbekistan//Championship Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${nowStamp()}`,
    `DTSTART:${toStamp(event.startsAt)}`,
    `DTEND:${toStamp(addMinutes(event.startsAt, event.durationMinutes))}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  // RFC 5545 is explicit that lines end CRLF, and Outlook holds it to the letter.
  return `${lines.map(fold).join('\r\n')}\r\n`
}

/**
 * Hands the event to the visitor's device as a downloaded `.ics`, which their
 * calendar app offers to import.
 *
 * @param event The event to write.
 * @param fileName Download name, without the extension.
 */
export const downloadCalendarEvent = (event: CalendarEvent, fileName: string): void => {
  const blob = new Blob([buildCalendarEvent(event)], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${fileName}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()

  // Freed on the next tick: revoking in the same frame as the click cancels the
  // download outright in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
