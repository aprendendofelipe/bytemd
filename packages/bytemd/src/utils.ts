import type { ViewerProps } from './types'
import { defaultSchema } from 'hast-util-sanitize'
import type { Schema } from 'hast-util-sanitize'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import type { Processor } from 'unified'

const schemaStr = JSON.stringify(defaultSchema)

/**
 * Get unified processor with ByteMD plugins
 */
export function getProcessor({
  sanitize,
  plugins,
  remarkRehype: remarkRehypeOptions = {},
}: Omit<ViewerProps, 'value'>) {
  let processor: Processor = unified().use(remarkParse)
  let schema = JSON.parse(schemaStr) as Schema

  plugins?.forEach(({ remark, sanitize }) => {
    if (remark) processor = remark(processor)
    if (typeof sanitize === 'function') {
      schema = sanitize(schema)
    }
  })
  processor = processor
    .use(remarkRehype, { allowDangerousHtml: true, ...remarkRehypeOptions })
    .use(rehypeRaw)

  if (typeof sanitize === 'function') {
    schema = sanitize(schema)
  }

  processor = processor.use(rehypeSanitize, schema)

  plugins?.forEach(({ rehype }) => {
    if (rehype) processor = rehype(processor)
  })

  return processor.use(rehypeStringify)
}
