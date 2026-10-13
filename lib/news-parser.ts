export type ContentBlock =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'quote'; text: string; author?: string }
  | { kind: 'attribution'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'paragraph'; text: string };

/**
 * Checks if a trimmed line represents a heading.
 * Handles:
 * 1. Markdown syntax (`## Heading`, `### Heading`)
 * 2. All-caps titles (e.g., "INFO DESK", "FROM THE AGS' DESK")
 * 3. Title-case section headers ending with a colon or specific digest keywords
 * 4. Short lines without sentence-ending periods/commas that match title patterns
 */
function isHeading(line: string): { isHeading: boolean; level: 2 | 3; cleanText: string } {
  // 1. Markdown headings: ## or ###
  const mdMatch = line.match(/^(#{1,3})\s+(.+)$/);
  if (mdMatch) {
    const level = mdMatch[1].length === 1 || mdMatch[1].length === 2 ? 2 : 3;
    return { isHeading: true, level, cleanText: mdMatch[2].trim() };
  }

  // If line ends with sentence punctuation (. or , or ;), it's generally a paragraph
  const endsWithSentencePunctuation = /[.,;]$/.test(line);

  // 2. Common Digest Section Title keywords (case-insensitive)
  const isDigestKeyword = /^(info desk|from the (?:ags'?|president's|pro's|general secretary's) desk|ulesite(?:s)? of the week|quote of the week|upcoming events?|announcement(?:s)?|editor'?s note|back to school|quadtopia is coming|first week of resumption|school fees & accommodation|countdown to resumption|meman youth career readiness conference)/i.test(
    line.replace(/[:\-—–]/g, '').trim()
  );

  if (isDigestKeyword && line.length <= 80) {
    return { isHeading: true, level: 2, cleanText: line.replace(/[:]$/, '').trim() };
  }

  // 3. All uppercase check with reasonable length, letters, and no sentence-ending punctuation
  const hasLetters = /[A-Z]/.test(line);
  const isAllUpper = hasLetters && line === line.toUpperCase();
  if (isAllUpper && line.length <= 65 && !endsWithSentencePunctuation && !line.startsWith('—')) {
    return { isHeading: true, level: 2, cleanText: line };
  }

  // 4. Short title ending with colon (e.g. "Key Highlights:")
  if (line.endsWith(':') && line.length <= 50 && !line.includes('. ')) {
    return { isHeading: true, level: 3, cleanText: line.slice(0, -1).trim() };
  }

  return { isHeading: false, level: 2, cleanText: line };
}

/**
 * Parses raw plain-text or lightweight markdown body into structured blocks.
 */
export function parseNewsBody(rawBody: string): ContentBlock[] {
  if (!rawBody) return [];

  const rawLines = rawBody.split('\n').map((l) => l.trim());
  const blocks: ContentBlock[] = [];
  let currentList: string[] | null = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (!line) {
      if (currentList && currentList.length > 0) {
        blocks.push({ kind: 'list', items: currentList });
        currentList = null;
      }
      continue;
    }

    // 1. Attribution: starts with -- (double hyphen), ~ (tilde), by/By:, or em/en dash (—/–)
    if (/^([—–]|--|~|(?:by:?\s))\s*/i.test(line)) {
      if (currentList) {
        blocks.push({ kind: 'list', items: currentList });
        currentList = null;
      }
      blocks.push({
        kind: 'attribution',
        text: line.replace(/^([—–]|--|~|(?:by:?\s))\s*/i, '— '),
      });
      continue;
    }

    // 2. Markdown Blockquote (> quote)
    if (line.startsWith('>')) {
      if (currentList) {
        blocks.push({ kind: 'list', items: currentList });
        currentList = null;
      }
      const quoteText = line.replace(/^>\s*/, '').trim();
      blocks.push({
        kind: 'quote',
        text: quoteText,
      });
      continue;
    }

    // 3. Bullet or Numbered Lists
    const listMatch = line.match(/^([*•\-]|(\d+)\.)\s+(.+)$/);
    if (listMatch) {
      const itemText = listMatch[3].trim();
      if (!currentList) {
        currentList = [itemText];
      } else {
        currentList.push(itemText);
      }
      continue;
    }

    // If we were building a list and encountered non-list text, flush the list
    if (currentList && currentList.length > 0) {
      blocks.push({ kind: 'list', items: currentList });
      currentList = null;
    }

    // 4. Check for Heading
    const headingCheck = isHeading(line);
    if (headingCheck.isHeading) {
      blocks.push({
        kind: 'heading',
        level: headingCheck.level,
        text: headingCheck.cleanText,
      });
      continue;
    }

    // 5. Standalone quotes (e.g. “Quote here” — Author)
    if ((line.startsWith('“') || line.startsWith('"')) && (line.endsWith('”') || line.endsWith('"'))) {
      blocks.push({
        kind: 'quote',
        text: line,
      });
      continue;
    }

    // 6. Default to standard paragraph
    blocks.push({
      kind: 'paragraph',
      text: line,
    });
  }

  // Flush any dangling list items
  if (currentList && currentList.length > 0) {
    blocks.push({ kind: 'list', items: currentList });
  }

  return blocks;
}
