export interface FaqItem {
  question: string
  answer: string
}

export const faq: FaqItem[] = [
  {
    question: "What's a real F1 driver's reaction time?",
    answer:
      'Elite drivers get away in roughly 200 ms. Anything under 150 ms on the real grid is flagged as a jump start.',
  },
  {
    question: 'Why is the wait before lights-out random?',
    answer:
      'Once all five lights are on, they hold for a random time before going out — here anywhere from 0.2 to 3 seconds. That stops anyone timing the start by rhythm: you have to react, not guess.',
  },
  {
    question: 'What counts as a jump start?',
    answer:
      'Any click, tap or Space press before the lights go out. The launch is voided and restarts, and it never counts towards your average.',
  },
  {
    question: 'Why is this slower than a normal click test?',
    answer:
      'Most click tests flip the whole screen to a new colour. Here the cue is five small lights going dark, which is a subtler signal to spot — just like on the grid — so times tend to come out a little higher.',
  },
  {
    question: 'Do the lights affect my score?',
    answer:
      'No. The clock only starts at lights-out. How long the lights take to come on, or how long they hold, never feeds into your time.',
  },
]
