import type { BytemdPlugin } from 'bytemd'
import deepmerge from 'deepmerge'
import rehypeHighlight, { Options } from 'rehype-highlight'

export default function highlightSsr({
  subset = false,
  ignoreMissing = true,
  ...rest
}: Options = {}): BytemdPlugin {
  return {
    rehype: (processor) =>
      processor.use(rehypeHighlight, { subset, ignoreMissing, ...rest }),
    sanitize: (schema) =>
      deepmerge(schema, {
        attributes: {
          code: [['className', 'hljs', /^language-/]],
          span: [['className', /^hljs-/]],
        },
      }),
  }
}
