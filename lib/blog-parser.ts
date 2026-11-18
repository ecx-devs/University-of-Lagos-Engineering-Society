import React from 'react';

export type BlogContentBlock =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'quote'; text: string; author?: string }
  | { kind: 'attribution'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'image'; src: string; alt?: string; caption?: string }
  | { kind: 'divider' }
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

    // 1. Horizontal divider (--- or *** or ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line)) {
      if (currentList && currentList.length > 0) {
        blocks.push({ kind: 'list', items: currentList });
        currentList = null;
      }
      blocks.push({ kind: 'divider' });
      continue;
    }

    // 2. Markdown Image: ![alt](url) or ![alt](url "caption") or ![alt|caption](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imgMatch) {
      if (currentList && currentList.length > 0) {
        blocks.push({ kind: 'list', items: currentList });
        currentList = null;
      }

      let altText = imgMatch[1].trim();
      let srcAndTitle = imgMatch[2].trim();
      let src = srcAndTitle;
      let caption: string | undefined = undefined;

      // Extract optional title as caption: ![alt](url "caption")
      const titleMatch = srcAndTitle.match(/^(\S+)\s+["'](.*?)["']$/);
      if (titleMatch) {
        src = titleMatch[1];
        caption = titleMatch[2].trim();
      } else if (altText.includes('|')) {
        // e.g. ![Alt|Caption text](url)
        const parts = altText.split('|');
        altText = parts[0].trim();
        caption = parts.slice(1).join('|').trim();
      } else if (altText && !altText.toLowerCase().startsWith('image') && altText !== 'img') {
        caption = altText;
      }

      blocks.push({
        kind: 'image',
        src,
        alt: altText || 'Blog image',
        caption: caption || undefined,
      });
      continue;
    }

    // 3. Attribution: starts with --, —, ~, or by:
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

    // 4. Blockquote (> quote)
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

    // 5. Bullet or Numbered Lists
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

    // 6. Heading
    const headingCheck = isHeading(line);
    if (headingCheck.isHeading) {
      blocks.push({
        kind: 'heading',
        level: headingCheck.level,
        text: headingCheck.cleanText,
      });
      continue;
    }

    // 7. Standalone quotes in quotation marks
    if ((line.startsWith('“') || line.startsWith('"')) && (line.endsWith('”') || line.endsWith('"'))) {
      blocks.push({
        kind: 'quote',
        text: line.slice(1, -1).trim(),
      });
      continue;
    }

    // 8. Standard paragraph
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

/**
 * Lightweight helper to render inline markdown styles (**bold**, *italic*, `code`, [link](url)).
 */
export function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split by inline markdown tokens: [link](url), **bold**, *italic*, `code`
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|__.*?__|(?<!\*)\*(?!\*).*?(?<!\*)\*(?!\*)|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Link: [label](href)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return React.createElement(
        'a',
        {
          key: i,
          href: linkMatch[2],
          target: '_blank',
          rel: 'noopener noreferrer',
          className:
            'text-[#C85B15] font-medium underline underline-offset-2 hover:opacity-85 transition-opacity',
        },
        linkMatch[1]
      );
    }

    // Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return React.createElement(
        'strong',
        { key: i, className: 'font-bold text-[#170A51]' },
        part.slice(2, -2)
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return React.createElement('em', { key: i, className: 'italic' }, part.slice(1, -1));
    }

    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return React.createElement(
        'code',
        {
          key: i,
          className: 'rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800',
        },
        part.slice(1, -1)
      );
    }

    return part;
  });
}
