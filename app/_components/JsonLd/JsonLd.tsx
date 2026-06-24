import { cache } from 'react';

type JsonLdProps = {
  /** A single schema.org object or an array of them. */
  data: Record<string, unknown> | Record<string, unknown>[];
  /** Stable id so React can dedupe identical scripts. */
  id?: string;
};

const serialize = cache((value: string) => value);

/**
 * Renders schema.org structured data as a JSON-LD script.
 * Output is sanitized against the `<` character to avoid breaking the tag.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  const json = serialize(JSON.stringify(data).replace(/</g, '\\u003c'));

  return (
    <script
      type="application/ld+json"
      id={id}
      // JSON is escaped above; this is the standard Next.js JSON-LD pattern.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
