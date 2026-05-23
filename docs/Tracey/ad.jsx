// ad.jsx — One full-page magazine ad.
// A4 portrait, screenshot LEFT, copy + CTA RIGHT. Reused for all 4 scenarios.

function Starburst({ size = 110, color, textColor, lines = [] }) {
  // tabloid "STAR DEAL!" sticker — 16-point sunburst
  const pts = 16;
  const r1 = size / 2;
  const r2 = size / 2.45;
  const path = Array.from({ length: pts * 2 }, (_, i) => {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (i * Math.PI) / pts - Math.PI / 2;
    return `${r * Math.cos(a) + size/2},${r * Math.sin(a) + size/2}`;
  }).join(' ');
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: 'rotate(-12deg)',
    }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <polygon points={path} fill={color} />
      </svg>
      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        color: textColor, fontFamily: '"Anton", sans-serif',
        textTransform: 'uppercase', lineHeight: 0.9,
        letterSpacing: '0.01em',
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: l.size || 18 }}>{l.text}</div>
        ))}
      </div>
    </div>
  );
}

function StoreBadge({ store, palette }) {
  // App Store / Play Store generic black badge (original, not Apple's exact mark)
  const isApple = store === 'apple';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: palette.ink, color: '#fff',
      padding: '9px 16px 9px 14px', borderRadius: 9,
      fontFamily: '"DM Sans", sans-serif',
      minWidth: 152,
    }}>
      {isApple ? (
        <svg width="22" height="26" viewBox="0 0 22 26" fill="#fff">
          <path d="M15.2 13.8c0-3.3 2.7-4.9 2.8-5-1.5-2.2-3.9-2.5-4.7-2.5-2-.2-3.9 1.2-4.9 1.2-1 0-2.6-1.2-4.2-1.1C2 6.4 0 7.9 0 11c0 1.8.3 3.6 1 5.3.8 2.2 3.5 7.6 6.3 7.5 1.4 0 2.3-.9 4.3-.9 2 0 2.8.9 4.3.9 2.8 0 5.2-5.1 5.9-7.3-3.7-1.4-6.5-2.7-6.6-2.7zM12.5 4.3c1-1.3 1.7-3 1.5-4.8C12.5 0 10.8 1 9.8 2.2 9 3.4 8 5.2 8.3 6.9c1.7.2 3.4-.9 4.2-2.6z"/>
        </svg>
      ) : (
        <svg width="22" height="26" viewBox="0 0 22 26">
          <path d="M2.5.6L13 12 2.5 23.4c-.3-.3-.5-.7-.5-1.2V1.8c0-.5.2-.9.5-1.2z" fill="#fff" opacity=".9"/>
          <path d="M16.3 8.8L13 12l3.3 3.2 3.2-1.8c1.2-.7 1.2-2 0-2.7l-3.2-1.9z" fill="#fff" opacity=".75"/>
          <path d="M13 12L2.5.6c.4-.4 1-.5 1.7-.1L16.3 8.8 13 12z" fill="#fff" opacity=".95"/>
          <path d="M13 12l3.3 3.2L4.2 23.5c-.7.4-1.3.3-1.7-.1L13 12z" fill="#fff" opacity=".85"/>
        </svg>
      )}
      <div style={{ lineHeight: 1.05 }}>
        <div style={{ fontSize: 9, opacity: 0.7, letterSpacing: '0.04em' }}>
          {isApple ? 'Download on the' : 'GET IT ON'}
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 1 }}>
          {isApple ? 'App Store' : 'Google Play'}
        </div>
      </div>
    </div>
  );
}

function CornerStamp({ palette, n }) {
  // "Nº1 / 4" issue-style stamp
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: '"DM Sans", sans-serif', fontSize: 10,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: palette.ink, opacity: 0.55, fontWeight: 600,
    }}>
      <span style={{
        display: 'inline-block', width: 18, height: 1, background: palette.ink, opacity: 0.4,
      }} />
      <span>Nº {n} / 04</span>
    </div>
  );
}

function MagazineAd({ ad, palette, headline, n }) {
  const { chatKey, badge, subhead, body, tagline, sticker } = ad;

  return (
    <div style={{
      width: 840, height: 1188,
      background: palette.bg,
      position: 'relative',
      fontFamily: '"DM Sans", sans-serif',
      color: palette.ink,
      overflow: 'hidden',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
    }}>
      {/* Outer paper border — magazine print bleed feel */}
      <div style={{
        position: 'absolute', inset: 22,
        border: `2px solid ${palette.accent}`,
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      {/* Top strip */}
      <div style={{
        position: 'absolute', top: 40, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        zIndex: 4,
      }}>
        {/* TUT! masthead */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{
            fontFamily: '"Alfa Slab One", serif',
            fontSize: 52,
            color: palette.accent,
            letterSpacing: '-0.02em',
            lineHeight: 0.85,
          }}>TUT!</span>
          <span style={{
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            fontWeight: 600, color: palette.ink, opacity: 0.65,
            paddingBottom: 4,
          }}>The mate sim · Issue 04</span>
        </div>
        <CornerStamp palette={palette} n={n} />
      </div>

      {/* Hairline under masthead */}
      <div style={{
        position: 'absolute', top: 110, left: 48, right: 48,
        height: 1, background: palette.ink, opacity: 0.18, zIndex: 4,
      }} />

      {/* LEFT: phone screenshot */}
      <div style={{
        position: 'absolute',
        left: 70, top: 168,
        width: 360, height: 800,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        zIndex: 2,
      }}>
        {/* Confetti-ish backdrop chips for energy */}
        <svg width="360" height="800" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <circle cx="30" cy="80" r="6" fill={palette.hot} opacity="0.45"/>
          <circle cx="320" cy="40" r="4" fill={palette.accent} opacity="0.6"/>
          <rect x="340" y="180" width="14" height="14" fill={palette.hot} opacity="0.35" transform="rotate(20 347 187)"/>
          <circle cx="10" cy="420" r="8" fill={palette.accent} opacity="0.25"/>
          <rect x="0" y="650" width="10" height="10" fill={palette.hot} opacity="0.4"/>
          <circle cx="340" cy="730" r="5" fill={palette.accent} opacity="0.5"/>
        </svg>
        <div style={{ transform: 'rotate(-3.5deg)', transformOrigin: 'center top' }}>
          <PhoneFrame width={320} palette={palette}>
            <ChatScreen chatKey={chatKey} palette={palette} />
          </PhoneFrame>
        </div>
        {/* sticker overlapping the phone */}
        {sticker && (
          <div style={{
            position: 'absolute',
            bottom: 60, right: -14,
            zIndex: 6,
          }}>
            <Starburst size={130} color={palette.hot} textColor={palette.bg} lines={sticker} />
          </div>
        )}
      </div>

      {/* RIGHT: copy stack */}
      <div style={{
        position: 'absolute',
        right: 48, top: 168,
        width: 360,
        display: 'flex', flexDirection: 'column', gap: 18,
        zIndex: 4,
      }}>
        {/* badge "AS SEEN…" */}
        <div style={{
          display: 'inline-flex', alignSelf: 'flex-start',
          background: palette.ink, color: palette.bg,
          padding: '6px 11px', borderRadius: 3,
          fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 700,
        }}>{badge}</div>

        {/* HEADLINE */}
        <h1 style={{
          fontFamily: '"Anton", sans-serif',
          fontWeight: 400,
          fontSize: 84,
          lineHeight: 0.92,
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          margin: 0,
          color: palette.ink,
          textWrap: 'balance',
        }}>
          {headline.split(' ').map((word, i, arr) => {
            // colour the last word in accent for punch
            const isLast = i === arr.length - 1;
            return (
              <span key={i} style={{ color: isLast ? palette.accent : palette.ink }}>
                {word}{i < arr.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </h1>

        {/* SUBHEAD */}
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 19,
          lineHeight: 1.32,
          fontStyle: 'italic',
          fontWeight: 500,
          color: palette.ink,
          opacity: 0.78,
          textWrap: 'balance',
        }}>"{subhead}"</div>

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ height: 4, width: 56, background: palette.hot }} />
          <div style={{ height: 1, flex: 1, background: palette.ink, opacity: 0.15 }} />
        </div>

        {/* BODY */}
        <p style={{
          fontFamily: 'Georgia, "DM Sans", serif',
          fontSize: 16,
          lineHeight: 1.45,
          margin: 0,
          color: palette.ink,
          textWrap: 'pretty',
        }}>{body}</p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 4 }}>
          <StoreBadge store="apple" palette={palette} />
          <StoreBadge store="google" palette={palette} />
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 'auto',
          fontSize: 10, letterSpacing: '0.16em',
          textTransform: 'uppercase', fontWeight: 600,
          color: palette.ink, opacity: 0.5,
        }}>{tagline}</div>
      </div>

      {/* Footer strip */}
      <div style={{
        position: 'absolute', bottom: 40, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 4,
        paddingTop: 16,
        borderTop: `1px solid ${palette.ink}22`,
      }}>
        <span style={{
          fontFamily: '"Alfa Slab One", serif',
          fontSize: 14, color: palette.accent, letterSpacing: '-0.01em',
        }}>TUT!</span>
        <span style={{
          fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: palette.ink, opacity: 0.55, fontWeight: 600,
        }}>Free · No ads · Encrypted chaos</span>
        <span style={{
          fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: palette.ink, opacity: 0.55, fontWeight: 600,
        }}>tut.app</span>
      </div>
    </div>
  );
}

Object.assign(window, { MagazineAd });
