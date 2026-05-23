// chat.jsx — Phone frame + Tracey chat screen used inside each magazine ad.
// All four ad scenarios share the same component and pass different scripts.

const CHATS = {
  magicMike: {
    title: 'Tracey',
    sub: 'last seen typing forever',
    time: '14:07',
    msgs: [
      { who: 't', text: 'hiya babes' },
      { who: 't', text: 'ok dont laugh' },
      { who: 't', text: 'brendas booked magic mike for her hen' },
      { who: 'u', text: 'the show??' },
      { who: 't', text: 'NO' },
      { who: 't', text: 'the actual man' },
      { who: 't', text: 'she thinks he does card tricks' },
      { who: 't', text: 'rang the venue asking if he brings doves' },
      { who: 't', text: 'anyway' },
      { who: 't', text: 'how r u' },
    ],
  },
  cake: {
    title: 'Tracey',
    sub: 'online',
    time: '09:42',
    msgs: [
      { who: 't', text: 'babe' },
      { who: 't', text: 'im in a&e' },
      { who: 't', text: 'dont ask' },
      { who: 'u', text: 'what?? are you ok' },
      { who: 't', text: 'yeah but mums phone is in the cake' },
      { who: 't', text: 'she was on a call' },
      { who: 't', text: 'put it down ON THE BOWL' },
      { who: 't', text: 'made a victoria sponge' },
      { who: 't', text: 'the cake is ringing janet' },
      { who: 't', text: 'anyway' },
    ],
  },
  paintball: {
    title: 'Tracey',
    sub: 'in a field, banbury',
    time: '11:23',
    msgs: [
      { who: 't', text: 'absolute state' },
      { who: 't', text: 'dave booked paintball for 14' },
      { who: 'u', text: 'fun!' },
      { who: 't', text: 'its me. and dave.' },
      { who: 'u', text: 'where is everyone?' },
      { who: 't', text: 'no one read the whatsapp' },
      { who: 't', text: 'im in camo. in a feild.' },
      { who: 't', text: 'dave is crying behind a hay bale' },
      { who: 't', text: 'christ on a bike' },
    ],
  },
  groupchat: {
    title: 'Tracey',
    sub: 'online',
    time: '22:18',
    msgs: [
      { who: 't', text: 'ok dont panic' },
      { who: 't', text: 'but tara is being slagged off in the group chat' },
      { who: 'u', text: 'isnt tara IN the group chat' },
      { who: 't', text: 'yes' },
      { who: 't', text: 'yes she is' },
      { who: 't', text: 'youll never guess who started it' },
      { who: 'u', text: 'WHO' },
      { who: 't', text: 'brenda. obviously.' },
      { who: 't', text: 'anyway' },
    ],
  },
};

function PhoneFrame({ children, width = 320, palette }) {
  // 19.5:9 ratio → phone height ≈ 2.1 × width minus a bit for body proportions
  const height = Math.round(width * 2.05);
  return (
    <div style={{
      width, height,
      background: '#0a0a0a',
      borderRadius: width * 0.13,
      padding: width * 0.025,
      boxShadow: `0 30px 60px -20px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.4), inset 0 0 0 ${width*0.005}px rgba(255,255,255,.06)`,
      position: 'relative',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: width * 0.105,
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: width * 0.035, left: '50%', transform: 'translateX(-50%)',
          width: width * 0.32, height: width * 0.085,
          background: '#000', borderRadius: 100, zIndex: 5,
        }} />
        {children}
      </div>
    </div>
  );
}

function StatusBar({ time = '14:07' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 26px 6px', fontSize: 13, fontWeight: 600, color: '#000',
      letterSpacing: '-0.01em',
    }}>
      <span>{time}</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill="#000"><rect x="0" y="7" width="3" height="4" rx=".5"/><rect x="4.5" y="5" width="3" height="6" rx=".5"/><rect x="9" y="2.5" width="3" height="8.5" rx=".5"/><rect x="13.5" y="0" width="3" height="11" rx=".5"/></g></svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="#000"><path d="M7.5 1.5C4.6 1.5 2 2.6 0 4.4l1.4 1.4C3 4.2 5.1 3.4 7.5 3.4s4.5.8 6.1 2.4L15 4.4C13 2.6 10.4 1.5 7.5 1.5zm0 3.6c-2 0-3.7.7-5 2l1.4 1.4c.9-.9 2.2-1.5 3.6-1.5s2.7.6 3.6 1.5L12.5 7.1c-1.3-1.3-3-2-5-2zm0 3.6c-1 0-1.9.4-2.6 1l2.6 2.6 2.6-2.6c-.7-.6-1.6-1-2.6-1z"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="#000" strokeOpacity=".4"/><rect x="23" y="4" width="1.5" height="4" rx=".5" fill="#000" fillOpacity=".4"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#000"/></svg>
      </span>
    </div>
  );
}

function ChatHeader({ title, sub, palette }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 14px 10px',
      borderBottom: '0.5px solid rgba(0,0,0,.08)',
      background: '#fafafa',
    }}>
      <svg width="11" height="18" viewBox="0 0 11 18" style={{ flex: '0 0 auto' }}>
        <path d="M9.5 1L1.5 9l8 8" stroke={palette.accent} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      </svg>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: `linear-gradient(135deg, ${palette.hot} 0%, ${palette.accent} 100%)`,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 16, fontFamily: '"Alfa Slab One", serif',
        letterSpacing: '-0.02em',
        flex: '0 0 auto',
      }}>T</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#000', letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'rgba(0,0,0,.45)', marginTop: 1 }}>{sub}</div>
      </div>
      <svg width="20" height="14" viewBox="0 0 20 14" style={{ opacity: 0.45 }}>
        <rect x="0" y="2" width="14" height="10" rx="2" fill="#000"/>
        <path d="M14 6l5-3v8l-5-3z" fill="#000"/>
      </svg>
      <svg width="16" height="16" viewBox="0 0 16 16" style={{ opacity: 0.45 }}>
        <path d="M3 5.5a4 4 0 014-4h2a4 4 0 014 4v.5a8 8 0 01-2.3 5.6l-1.4 1.4a2 2 0 01-2.6 0L5.3 11.6A8 8 0 013 6V5.5z" fill="#000"/>
      </svg>
    </div>
  );
}

function Bubble({ who, text, palette, isLastOfRun }) {
  const isUser = who === 'u';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 3,
    }}>
      <div style={{
        maxWidth: '72%',
        padding: '7px 12px',
        borderRadius: 18,
        ...(isUser ? {
          background: palette.hot,
          color: '#fff',
          borderBottomRightRadius: isLastOfRun ? 5 : 18,
        } : {
          background: '#ececec',
          color: '#000',
          borderBottomLeftRadius: isLastOfRun ? 5 : 18,
        }),
        fontSize: 13.5,
        lineHeight: 1.32,
        letterSpacing: '-0.005em',
        wordBreak: 'break-word',
      }}>{text}</div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 3 }}>
      <div style={{
        background: '#ececec', padding: '10px 14px', borderRadius: 18,
        borderBottomLeftRadius: 5,
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: '#999',
            animation: `tut-dot 1.2s ${i*0.15}s infinite ease-in-out`,
          }} />
        ))}
      </div>
    </div>
  );
}

function InputBar({ palette }) {
  return (
    <div style={{
      borderTop: '0.5px solid rgba(0,0,0,.08)',
      padding: '8px 10px 14px',
      display: 'flex', gap: 7, alignItems: 'center',
      background: '#fafafa',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(0,0,0,.4)', fontSize: 18, fontWeight: 300,
        flex: '0 0 auto',
      }}>+</div>
      <div style={{
        flex: 1,
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,.12)',
        borderRadius: 18, padding: '6px 12px',
        fontSize: 13, color: 'rgba(0,0,0,.35)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>iMessage</span>
        <span style={{ fontSize: 16, color: 'rgba(0,0,0,.3)' }}>🎙</span>
      </div>
    </div>
  );
}

function ChatScreen({ chatKey, palette }) {
  const chat = CHATS[chatKey];
  // figure out last-of-run for bubble tail
  const msgs = chat.msgs.map((m, i, arr) => {
    const next = arr[i+1];
    return { ...m, isLastOfRun: !next || next.who !== m.who };
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <StatusBar time={chat.time} />
      <ChatHeader title={chat.title} sub={chat.sub} palette={palette} />
      <div style={{
        flex: 1, overflow: 'hidden', padding: '12px 10px 4px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {msgs.map((m, i) => (
          <Bubble key={i} {...m} palette={palette} />
        ))}
        <TypingBubble />
      </div>
      <InputBar palette={palette} />
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
        width: 110, height: 4, borderRadius: 2, background: '#000',
      }} />
    </div>
  );
}

// Expose
Object.assign(window, { ChatScreen, PhoneFrame, CHATS });
