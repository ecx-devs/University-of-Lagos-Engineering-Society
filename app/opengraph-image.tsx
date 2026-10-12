import { ImageResponse } from 'next/og';

import { SITE } from '@/lib/seo';

/**
 * Site-wide social card, generated at build time.
 *
 * No custom font is loaded on purpose: fetching one at build time makes the
 * build depend on a network round trip (which has already failed once here),
 * and the bundled default renders this layout perfectly well.
 */

export const alt = `${SITE.fullName} — ULES`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #1A2B56 0%, #1E293B 100%)',
        }}
      >
        <div style={{ display: 'flex', width: 96, height: 8, background: '#4E9F41' }} />
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 72,
            fontWeight: 700,
            color: '#F9FAFB',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          University of Lagos
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#F9FAFB',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Engineering Society
        </div>
        <div style={{ display: 'flex', marginTop: 32, fontSize: 32, color: '#CBD5E1' }}>
          6,000+ students · 10 departments · since 1964
        </div>
      </div>
    ),
    size,
  );
}
