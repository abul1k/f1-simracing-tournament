/**
 * A dependency-free structural validator for the JSON files under `data/`.
 *
 * It exists so `scripts/validateData.ts` can report problems as
 * `file → field path → what is wrong`, which is what a non-programmer admin
 * needs to fix a bad edit, rather than a stack trace.
 */

export interface Issue {
  file: string
  path: string
  message: string
}

export type Spec =
  | {
      kind: 'string'
      enum?: readonly string[]
      pattern?: RegExp
      minLength?: number
      /** Accepts `""` as a deliberate "no value", skipping the other checks. */
      allowEmpty?: boolean
      /** Accepts `null` as a deliberate "no value", e.g. a driver with no team. */
      nullable?: boolean
    }
  | { kind: 'number'; integer?: boolean; min?: number; max?: number; nullable?: boolean }
  | { kind: 'boolean' }
  | { kind: 'array'; of: Spec; minItems?: number }
  | { kind: 'object'; fields: Record<string, Spec>; optional?: readonly string[] }
  | { kind: 'record'; of: Spec; keyPattern?: RegExp }

const typeName = (value: unknown): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'

  return typeof value
}

const show = (value: unknown): string =>
  typeof value === 'string' ? `"${value}"` : String(value)

const join = (path: string, key: string): string => (path ? `${path}.${key}` : key)

/**
 * Checks `value` against `spec`, appending a readable message to `issues`
 * for every problem found. Validation is exhaustive — it does not stop at
 * the first error, so an admin sees every mistake in one run.
 *
 * @param value Parsed JSON to check.
 * @param spec The expected shape.
 * @param path Field path used in messages, e.g. `[3].teamId`. Pass `''` at the root.
 * @param file Data file name used in messages, e.g. `data/drivers.json`.
 * @param issues Accumulator that collected problems are pushed onto.
 */
export const validate = (
  value: unknown,
  spec: Spec,
  path: string,
  file: string,
  issues: Issue[],
): void => {
  const fail = (message: string): void => {
    issues.push({ file, path: path || '(root)', message })
  }

  if (spec.kind === 'string') {
    if (spec.nullable && value === null) return

    if (typeof value !== 'string') {
      const suffix = spec.nullable ? ' or null' : ''

      return fail(`must be a string${suffix}, got ${typeName(value)}`)
    }
    if (spec.allowEmpty && value === '') return

    if (spec.enum && !spec.enum.includes(value)) {
      return fail(`must be one of ${spec.enum.join(', ')} — got ${show(value)}`)
    }
    if (spec.pattern && !spec.pattern.test(value)) {
      return fail(`${show(value)} does not match the expected format ${spec.pattern}`)
    }
    if (spec.minLength !== undefined && value.length < spec.minLength) {
      return fail(`must be at least ${spec.minLength} character(s), got ${show(value)}`)
    }

    return
  }

  if (spec.kind === 'number') {
    if (spec.nullable && value === null) return

    if (typeof value !== 'number' || Number.isNaN(value)) {
      const suffix = spec.nullable ? ' or null' : ''

      return fail(`must be a number${suffix}, got ${typeName(value)}`)
    }
    if (spec.integer && !Number.isInteger(value)) {
      return fail(`must be a whole number, got ${value}`)
    }
    if (spec.min !== undefined && value < spec.min) {
      return fail(`must be ${spec.min} or greater, got ${value}`)
    }
    if (spec.max !== undefined && value > spec.max) {
      return fail(`must be ${spec.max} or less, got ${value}`)
    }

    return
  }

  if (spec.kind === 'boolean') {
    if (typeof value !== 'boolean') {
      return fail(`must be true or false, got ${typeName(value)}`)
    }

    return
  }

  if (spec.kind === 'array') {
    if (!Array.isArray(value)) {
      return fail(`must be an array, got ${typeName(value)}`)
    }
    if (spec.minItems !== undefined && value.length < spec.minItems) {
      return fail(`must contain at least ${spec.minItems} item(s), got ${value.length}`)
    }
    value.forEach((item, index) => {
      validate(item, spec.of, `${path}[${index}]`, file, issues)
    })

    return
  }

  if (spec.kind === 'record') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return fail(`must be an object, got ${typeName(value)}`)
    }
    Object.entries(value).forEach(([key, item]) => {
      if (spec.keyPattern && !spec.keyPattern.test(key)) {
        fail(`key ${show(key)} does not match the expected format ${spec.keyPattern}`)
      }
      validate(item, spec.of, join(path, key), file, issues)
    })

    return
  }

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return fail(`must be an object, got ${typeName(value)}`)
  }

  const record = value as Record<string, unknown>
  const optional = new Set(spec.optional ?? [])

  Object.entries(spec.fields).forEach(([key, fieldSpec]) => {
    if (!(key in record)) {
      if (!optional.has(key)) fail(`missing required field "${key}"`)

      return
    }
    validate(record[key], fieldSpec, join(path, key), file, issues)
  })

  Object.keys(record).forEach((key) => {
    if (!(key in spec.fields)) {
      fail(`unknown field "${key}" — remove it or check the spelling`)
    }
  })
}

/** Formats collected issues as a human-readable report grouped by file. */
export const formatIssues = (issues: Issue[]): string => {
  const byFile = new Map<string, Issue[]>()

  issues.forEach((issue) => {
    const bucket = byFile.get(issue.file) ?? []

    bucket.push(issue)
    byFile.set(issue.file, bucket)
  })

  return [...byFile.entries()]
    .map(([file, list]) => {
      const lines = list.map((issue) => `    ${issue.path} — ${issue.message}`)

      return `  ${file}\n${lines.join('\n')}`
    })
    .join('\n\n')
}
