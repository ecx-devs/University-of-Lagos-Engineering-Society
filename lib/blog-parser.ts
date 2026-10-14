export type BlogContentBlock =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'quote'; text: string; author?: string }
  | { kind: 'attribution'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'paragraph'; text: string };

/**
 * Checks if a trimmed line is a heading.
 */
function isHeading(line: string): { isHeading: boolean; level: 2 | 3; cleanText: string } {
  const mdMatch = line.match(/^(#{1,3})\s+(.+)$/);
  if (mdMatch) {
    const level = mdMatch[1].length === 1 || mdMatch[1].length === 2 ? 2 : 3;
    return { isHeading: true, level, cleanText: mdMatch[2].trim() };
  }

  // Short uppercase lines without punctuation
  const hasLetters = /[A-Z]/.test(line);
  const isAllUpper = hasLetters && line === line.toUpperCase();
  if (isAllUpper && line.length <= 60 && !/[.,;]$/.test(line) && !line.startsWith('—')) {
    return { isHeading: true, level: 2, cleanText: line };
  }

  // Short title ending with colon
  if (line.endsWith(':') && line.length <= 50 && !line.includes('. ')) {
    return { isHeading: true, level: 3, cleanText: line.slice(0, -1).trim() };
  }

  return { isHeading: false, level: 2, cleanText: line };
}

/**
 * Parses raw plain-text / markdown into structured blocks for blog rendering.
 */
export function parseBlogBody(rawBody: string): BlogContentBlock[] {
  if (!rawBody) return [];

  const rawLines = rawBody.split('\n').map((l) => l.trim());
  const blocks: BlogContentBlock[] = [];
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

    // 1. Attribution: starts with --, —, ~, or by:
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

    // 2. Blockquote (> quote)
    if (line.startsWith('>')) {
      if (currentList) {
        blocks.push({ kind: 'list', items: currentList });
        currentList = null;
      }
      const quoteText = line.replace(/^>\s*/, '').replace(/^["“”]|["“”]$/g, '').trim();
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

    // Flush list if encountering non-list text
    if (currentList && currentList.length > 0) {
      blocks.push({ kind: 'list', items: currentList });
      currentList = null;
    }

    // 4. Heading
    const headingCheck = isHeading(line);
    if (headingCheck.isHeading) {
      blocks.push({
        kind: 'heading',
        level: headingCheck.level,
        text: headingCheck.cleanText,
      });
      continue;
    }

    // 5. Standalone quotes in quotation marks
    if ((line.startsWith('“') || line.startsWith('"')) && (line.endsWith('”') || line.endsWith('"'))) {
      blocks.push({
        kind: 'quote',
        text: line.slice(1, -1).trim(),
      });
      continue;
    }

    // 6. Standard paragraph
    blocks.push({
      kind: 'paragraph',
      text: line,
    });
  }

  if (currentList && currentList.length > 0) {
    blocks.push({ kind: 'list', items: currentList });
  }

  return blocks;
}
