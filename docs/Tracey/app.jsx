// app.jsx — TUT! magazine ad campaign — design canvas of 4 full-page ads.

const PALETTES = {
  magPink: {
    name: 'Mag Pink',
    bg: '#FAE6D9',
    ink: '#1A1A1A',
    accent: '#C71F37',
    hot: '#FF2D7A',
  },
  peachPunch: {
    name: 'Peach Punch',
    bg: '#FFD7C2',
    ink: '#2B1810',
    accent: '#E63946',
    hot: '#FF6B35',
  },
  creamMagenta: {
    name: 'Cream Magenta',
    bg: '#FFE9F2',
    ink: '#1A1A1A',
    accent: '#FF1F8F',
    hot: '#C71585',
  },
  sunnySide: {
    name: 'Sunny Side',
    bg: '#FFF1E6',
    ink: '#1A1A1A',
    accent: '#FF6B9D',
    hot: '#E63946',
  },
};

// Ad scenarios — fixed creative content (headlines are tweakable separately).
const ADS = [
  {
    id: 'magicMike',
    label: '01 · Magic Mike',
    chatKey: 'magicMike',
    badge: 'New App · 99p',
    defaultHeadline: 'BRENDA. BOOKED. MAGIC MIKE.',
    subhead: 'She thinks he does card tricks. The deposit is non-refundable.',
    body: "Tracey's mate Brenda has booked Magic Mike for her hen do. She rang the venue at half ten to ask if he brings doves. He does not. Open the app. Watch it unfold.",
    tagline: 'A new mate. Every five minutes.',
    sticker: [{ text: 'OH', size: 26 }, { text: 'BREN', size: 26 }, { text: 'DA', size: 26 }],
  },
  {
    id: 'cake',
    label: '02 · Phone in Cake',
    chatKey: 'cake',
    badge: 'Top 10 · UK Lifestyle',
    defaultHeadline: 'THE CAKE IS RINGING.',
    subhead: "Mum's phone is in the sponge. She's still on the call to Janet.",
    body: "Tracey is in A&E. Don't ask. Her mother baked a Victoria sponge with the phone inside it, on speakerphone, to Janet from Pilates. Tracey will tell you the rest. Slowly.",
    tagline: 'Five-minute mate. No notifications.',
    sticker: [{ text: 'IN', size: 22 }, { text: 'A&E', size: 30 }, { text: '!!!', size: 22 }],
  },
  {
    id: 'paintball',
    label: '03 · Paintball Disaster',
    chatKey: 'paintball',
    badge: 'Editor\'s Pick',
    defaultHeadline: "IT'S JUST ME AND DAVE.",
    subhead: 'He booked paintball for fourteen. Nobody read the WhatsApp.',
    body: "Tracey is in a hi-vis camo jumpsuit in a field outside Banbury. So is Dave. The fourteen friends Dave invited are not. Dave is crying behind a hay bale. Tracey is texting you.",
    tagline: 'Christ on a bike. Free download.',
    sticker: [{ text: 'JUST', size: 22 }, { text: 'DAVE', size: 30 }, { text: '!!', size: 22 }],
  },
  {
    id: 'groupchat',
    label: '04 · Group Chat',
    chatKey: 'groupchat',
    badge: 'As Featured · Heat Adjacent',
    defaultHeadline: 'TARA IS IN THE CHAT.',
    subhead: "And she's being slagged off in it. Right now. By Brenda.",
    body: "Tracey has discovered, at 22:18 on a Tuesday, that Tara is being slagged off in a group chat Tara is a member of. Tracey will not be telling Tara. Tracey will be telling you.",
    tagline: "Don't tell Tara. Free for now.",
    sticker: [{ text: 'BREN', size: 24 }, { text: 'DID', size: 28 }, { text: 'IT', size: 28 }],
  },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "magPink",
  "h1": "BRENDA. BOOKED. MAGIC MIKE.",
  "h2": "THE CAKE IS RINGING.",
  "h3": "IT'S JUST ME AND DAVE.",
  "h4": "TARA IS IN THE CHAT."
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[t.palette] || PALETTES.magPink;
  const headlines = [t.h1, t.h2, t.h3, t.h4];

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="campaign"
          title="TUT! · Magazine Ad Campaign"
          subtitle="Four full-page (A4) ads — Tracey's chaos, in print"
        >
          {ADS.map((ad, i) => (
            <DCArtboard
              key={ad.id}
              id={ad.id}
              label={ad.label}
              width={840}
              height={1188}
            >
              <div data-screen-label={ad.label}>
                <MagazineAd
                  ad={ad}
                  palette={palette}
                  headline={headlines[i] || ad.defaultHeadline}
                  n={i + 1}
                />
              </div>
            </DCArtboard>
          ))}
        </DCSection>

        <DCSection
          id="system"
          title="Type & Colour System"
          subtitle="What's holding the campaign together"
        >
          <DCArtboard id="type" label="Typography" width={620} height={520}>
            <TypeSystem palette={palette} />
          </DCArtboard>
          <DCArtboard id="palette-art" label="Palette" width={620} height={520}>
            <PaletteCard palette={palette} />
          </DCArtboard>
          <DCArtboard id="masthead" label="Masthead lockup" width={620} height={520}>
            <MastheadCard palette={palette} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Palette" />
        <TweakRadio
          label="Warm palette"
          value={t.palette}
          options={['magPink', 'peachPunch', 'creamMagenta', 'sunnySide']}
          onChange={(v) => setTweak('palette', v)}
        />
        <TweakSection label="Headlines" />
        <TweakText
          label="Ad 01 · Magic Mike"
          value={t.h1}
          onChange={(v) => setTweak('h1', v)}
        />
        <TweakText
          label="Ad 02 · Cake"
          value={t.h2}
          onChange={(v) => setTweak('h2', v)}
        />
        <TweakText
          label="Ad 03 · Paintball"
          value={t.h3}
          onChange={(v) => setTweak('h3', v)}
        />
        <TweakText
          label="Ad 04 · Group Chat"
          value={t.h4}
          onChange={(v) => setTweak('h4', v)}
        />
      </TweaksPanel>
    </>
  );
}

function TypeSystem({ palette }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: palette.bg, padding: 36,
      fontFamily: '"DM Sans", sans-serif', color: palette.ink,
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: '"Alfa Slab One", serif', fontSize: 56, color: palette.accent, lineHeight: 0.85 }}>Aa</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Alfa Slab One</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Wordmark · TUT! lockup only</div>
        </div>
      </div>
      <div style={{ height: 1, background: palette.ink, opacity: 0.12 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: '"Anton", sans-serif', fontSize: 68, color: palette.ink, lineHeight: 0.85 }}>Aa</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Anton</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Headlines · all caps · max 4 words</div>
        </div>
      </div>
      <div style={{ height: 1, background: palette.ink, opacity: 0.12 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontStyle: 'italic', fontSize: 56, color: palette.ink, lineHeight: 0.85 }}>Aa</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>DM Sans Italic</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Subheading · in quotes · one line</div>
        </div>
      </div>
      <div style={{ height: 1, background: palette.ink, opacity: 0.12 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 56, color: palette.ink, lineHeight: 0.85 }}>Aa</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Georgia</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Body copy · Heat-mag editorial feel</div>
        </div>
      </div>
      <div style={{ marginTop: 'auto', fontSize: 11, opacity: 0.55, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>
        Hierarchy: 84 / 19 / 16 / 10
      </div>
    </div>
  );
}

function PaletteCard({ palette }) {
  const swatches = [
    { label: 'Background', hex: palette.bg },
    { label: 'Ink', hex: palette.ink },
    { label: 'Accent', hex: palette.accent },
    { label: 'Hot', hex: palette.hot },
  ];
  return (
    <div style={{
      width: '100%', height: '100%',
      background: palette.bg, padding: 36,
      fontFamily: '"DM Sans", sans-serif', color: palette.ink,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.65 }}>
        {palette.name} · 4-tone
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
        {swatches.map((s) => (
          <div key={s.label} style={{
            background: s.hex,
            borderRadius: 4,
            padding: 16,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            color: s.hex === palette.ink ? palette.bg : palette.ink,
            border: s.hex === palette.bg ? `1px solid ${palette.ink}22` : 'none',
            minHeight: 120,
          }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
            <div style={{ fontSize: 11, opacity: 0.75, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{s.hex.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, opacity: 0.55, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
        Print CMYK · Digital RGB
      </div>
    </div>
  );
}

function MastheadCard({ palette }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: palette.bg, padding: 36,
      fontFamily: '"DM Sans", sans-serif', color: palette.ink,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.65 }}>
        Masthead lockup
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{
          fontFamily: '"Alfa Slab One", serif',
          fontSize: 180, color: palette.accent,
          letterSpacing: '-0.03em', lineHeight: 0.85,
        }}>TUT!</div>
        <div style={{
          fontSize: 14, letterSpacing: '0.32em',
          textTransform: 'uppercase', fontWeight: 600, opacity: 0.7,
        }}>The mate sim</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.55 }}>
        <span>Always 30° optical lean</span>
        <span>Min 24pt safe area</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
