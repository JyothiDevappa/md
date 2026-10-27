import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, CalendarDays, ChevronDown, Clapperboard, Film, Heart, Languages, LockKeyhole, Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Smartphone, Sparkles, Volume2, VolumeX, X } from 'lucide-react';

// EDIT THIS DATE to the birthday being celebrated. Date format: YYYY-MM-DD.
export const EXPECTED_BIRTHDAY = '1999-11-15';

type Memory = {
  id: string;
  title: string;
  category: string;
  year: string;
  runtime: string;
  rating: string;
  image: string;
  accent: string;
  description: string;
  note: string;
  kind: string;
};

const memories: Memory[] = [
  {
    id: 'side-quests', title: 'Side Quests & Snacks', category: 'Adventures', year: 'The best detours', runtime: 'One more stop, always', rating: '10/10', kind: 'A comedy with excellent snacks',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1500&q=85', accent: '#E50914',
    description: 'We set out with a plan. The plan lasted twelve minutes. What followed was a scenic detour, a questionable amount of snacks, and the kind of laughing that makes strangers turn around.',
    note: 'Best enjoyed with no itinerary and an unreasonable number of fries.'
  },
  {
    id: 'soft-place', title: 'My Soft Place', category: 'Us, lately', year: 'Right here, right now', runtime: 'Comfort, on repeat', rating: '∞', kind: 'A love letter in small scenes',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1500&q=85', accent: '#E50914',
    description: 'It turns out home can be a person. The quiet in the car, the familiar voice from another room, the way a hard day loosens its grip when you are near.',
    note: 'A reminder that in every version of the story, I am glad it is you.'
  },
  {
    id: 'main-character', title: 'Main Character Energy', category: 'That’s so you', year: 'Every single day', runtime: 'An ongoing masterpiece', rating: 'Certified', kind: 'The story of your becoming',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', accent: '#E50914',
    description: 'A highlight reel of you being completely, impossibly yourself. The brave bits. The kind bits. The moments you did not even notice were extraordinary.',
    note: 'The world is luckier with you in it. I hope you know that.'
  },
  {
    id: 'little-traditions', title: 'Our Little Traditions', category: 'Little things', year: 'A ritual in progress', runtime: 'The comfort rewatch', rating: 'Beloved', kind: 'A quietly perfect series',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85', accent: '#E50914',
    description: 'The tiny rituals that became ours without either of us deciding. Familiar orders, familiar jokes, familiar ways of saying I am here.',
    note: 'Here is to all the little things we will keep making ours.'
  },
  {
    id: 'next-chapter', title: 'The Next Chapter', category: 'Coming soon', year: 'Premieres today', runtime: 'No spoilers, just hope', rating: 'Highly anticipated', kind: 'Something wonderful is on its way',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85', accent: '#E50914',
    description: 'A whole new year of you. New places to wander, new things to learn, new reasons to laugh until it hurts. Whatever this next chapter holds, I cannot wait to see you in it.',
    note: 'The best part is that the story is still being written.'
  },
];

const categories = ['All memories', 'Little things', 'Adventures', 'Us, lately', 'That’s so you', 'Coming soon'];

function ImageFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!failed ? <img src={src} alt={alt} onError={() => setFailed(true)} className="poster-image absolute inset-0 h-full w-full object-cover" /> : (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 75% 20%, #E5091466, transparent 35%), linear-gradient(145deg, #292929, #141414 72%)' }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/85 via-transparent to-[#141414]/10" />
    </div>
  );
}

function NetflixStyleLogo({ className = '' }: { className?: string }) {
  /*
   * Netflix-authentic logo with the signature subtle upward arch/bend.
   * Tight letter spacing, bold condensed Impact font, Netflix red.
   */
  return (
    <svg
      viewBox="0 0 230 55"
      className={`h-[45px] sm:h-[55px] md:h-[60px] w-auto overflow-visible select-none cursor-default ${className}`}
      aria-label="MANUFLIX"
      role="img"
    >
      <defs>
        {/* Subtle upward arc — Netflix's signature bend */}
        <path id="manuflix-curve" d="M 5 45 Q 115 18 225 45" fill="none" />
        <filter id="netflix-shadow" x="-10%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.7" />
        </filter>
      </defs>
      <text
        fill="#E50914"
        filter="url(#netflix-shadow)"
        style={{
          fontFamily: '"Bebas Neue", "Arial Narrow", Impact, sans-serif',
          fontWeight: 400,
          fontSize: '46px',
          letterSpacing: '0.02em',
        }}
      >
        <textPath href="#manuflix-curve" startOffset="50%" textAnchor="middle">
          MANUFLIX
        </textPath>
      </text>
    </svg>
  );
}

type Language = 'en' | 'hi';

const gateTranslations = {
  en: {
    language: 'English',
    signIn: 'Sign In',
    titleLine1: 'Unlimited memories,',
    titleLine2: 'shows, and more',
    priceText: 'Starts at ₹149. no Cancelation.',
    readyText: 'Ready to watch? Enter your birthday date',
    getStarted: 'Get Started',
    chooseBirthdayMsg: 'Choose your birthday to open your premiere.',
    premiereFooter: 'See, I remembered your birthday date 😎',
    // Sign In Screen
    signInTitle: 'Enter your info to sign in',
    signInSubtitle: 'Or get started with a new account.',
    birthdayLabel: 'Birthday Date',
    continueBtn: 'Continue',
    getHelp: 'Get Help',
    helpHint: 'Hint: Enter the special birthday date to unlock this premiere.',
    recaptchaText: "This page is protected by Google reCAPTCHA to ensure you're not a bot.",
    backToHome: 'Back to home',
  },
  hi: {
    language: 'हिन्दी',
    signIn: 'साइन इन करें',
    titleLine1: 'अनलिमिटेड यादें,',
    titleLine2: 'शोज़ और बहुत कुछ',
    priceText: '₹149 से शुरू। नो कैंसिलेशन।',
    readyText: 'देखने के लिए तैयार हैं? अपनी जन्मतिथि दर्ज करें',
    getStarted: 'शुरू करें',
    chooseBirthdayMsg: 'अपना प्रीमियर खोलने के लिए अपनी जन्मतिथि चुनें।',
    premiereFooter: 'देखो, मुझे आपकी जन्मतिथि याद थी 😎',
    // Sign In Screen
    signInTitle: 'साइन इन करने के लिए अपनी जानकारी दर्ज करें',
    signInSubtitle: 'या नए खाते के साथ शुरुआत करें।',
    birthdayLabel: 'जन्मतिथि',
    continueBtn: 'जारी रखें',
    getHelp: 'मदद चाहिए',
    helpHint: 'संकेत: इस प्रीमियर को अनलॉक करने के लिए जन्मतिथि दर्ज करें।',
    recaptchaText: 'यह पेज Google reCAPTCHA द्वारा सुरक्षित है ताकि यह सुनिश्चित हो सके कि आप बॉट नहीं हैं।',
    backToHome: 'होम पर वापस जाएं',
  },
};

function NetflixLanguageSelect({ lang, onChange }: { lang: Language; onChange: (lang: Language) => void }) {
  return (
    <div className="relative inline-flex items-center">
      <div className="pointer-events-none absolute left-2.5 z-10 flex items-center text-white/90">
        <Languages size={14} />
      </div>
      <select
        data-testid="select-language"
        value={lang}
        onChange={(e) => onChange(e.target.value as Language)}
        className="h-[34px] cursor-pointer appearance-none rounded-[4px] border border-white/40 bg-black/50 pl-7 pr-6 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition hover:border-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
        aria-label="Select language"
      >
        <option value="en" className="bg-[#141414] text-white">
          English
        </option>
        <option value="hi" className="bg-[#141414] text-white">
          हिन्दी
        </option>
      </select>
      <div className="pointer-events-none absolute right-2 z-10 flex items-center text-white/90">
        <ChevronDown size={13} />
      </div>
    </div>
  );
}

function BirthdayGate({ onUnlock }: { onUnlock: (selectedDate: string) => void }) {
  const [view, setView] = useState<'landing' | 'signin'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#signin' ? 'signin' : 'landing';
  });
  const [lang, setLang] = useState<Language>('en');
  const [birthday, setBirthday] = useState('');
  const [message, setMessage] = useState('');
  const [shaking, setShaking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      setView(window.location.hash === '#signin' ? 'signin' : 'landing');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const t = gateTranslations[lang];

  const navigateTo = (newView: 'landing' | 'signin') => {
    setView(newView);
    if (newView === 'signin') {
      window.location.hash = '#signin';
    } else {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!birthday) {
      setMessage(t.chooseBirthdayMsg);
      setShaking(true);
      window.setTimeout(() => setShaking(false), 500);
      return;
    }
    setMessage('');
    onUnlock(birthday);
  }

  // SIGN IN VIEW (matches Netflix Sign In page with top red ambient glow, line, and birthday form)
  if (view === 'signin') {
    return (
      <main
        className="relative flex min-h-[100dvh] flex-col justify-between overflow-x-hidden bg-black text-white"
        style={{
          background: 'radial-gradient(ellipse 90% 50% at 50% -10%, rgba(130, 20, 25, 0.42) 0%, rgba(10, 10, 10, 0.98) 55%, #000000 100%)',
        }}
      >
        <div>
          {/* Header with MANUFLIX logo and Language selector */}
          <header className="relative z-20 flex w-full items-center justify-between px-6 py-5 sm:px-12 md:px-16 lg:px-24 xl:px-36">
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              title={t.backToHome}
              className="transition hover:opacity-90 active:scale-95"
            >
              <NetflixStyleLogo />
            </button>
            <NetflixLanguageSelect lang={lang} onChange={setLang} />
          </header>

          {/* Full-width dividing line identical to Netflix login screen */}
          <div className="w-full border-b border-[#2e2e2e]" />
        </div>

        {/* Center Content for Sign In */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-4 pt-12 pb-16">
          <div className="w-full max-w-[450px] text-left">
            <h1 className="text-3xl sm:text-[34px] font-bold text-white tracking-tight leading-snug">
              {t.signInTitle}
            </h1>
            <p className="mt-2 text-base text-[#a6a6a6]">
              {t.signInSubtitle}
            </p>

            <form onSubmit={submit} className={`mt-7 ${shaking ? 'animate-[shake_.4s_ease-in-out]' : ''}`}>
              {/* Netflix-style input container */}
              <div className="relative w-full rounded-[4px] border border-[#555] bg-[#161616] px-4 pt-2.5 pb-2 transition focus-within:border-white focus-within:ring-1 focus-within:ring-white">
                <label htmlFor="signin-birthday" className="block text-xs font-normal text-[#8c8c8c]">
                  {t.birthdayLabel}
                </label>
                <div className="flex items-center justify-between gap-2">
                  <input
                    id="signin-birthday"
                    data-testid="input-signin-birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => {
                      setBirthday(e.target.value);
                      setMessage('');
                    }}
                    className="h-9 w-full bg-transparent text-base text-white outline-none [color-scheme:dark]"
                  />
                  <CalendarDays size={18} className="pointer-events-none text-white/50 shrink-0" />
                </div>
              </div>

              {message && (
                <p data-testid="status-birthday" className="mt-2 text-sm font-medium text-[#E50914]">
                  {message}
                </p>
              )}

              <button
                data-testid="button-signin-unlock"
                type="submit"
                className="mt-4 flex h-12 w-full items-center justify-center rounded-[4px] bg-[#E50914] text-base font-semibold text-white transition hover:bg-[#c11119] active:scale-[0.99]"
              >
                {t.continueBtn}
              </button>

              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="mt-4 flex items-center gap-1 text-sm text-[#cccccc] hover:underline"
              >
                {t.getHelp} <ChevronDown size={14} className={`transition-transform duration-200 ${showHelp ? 'rotate-180' : ''}`} />
              </button>

              {showHelp && (
                <div className="mt-2 rounded-[4px] border border-white/10 bg-[#1e1e1e] p-3 text-xs text-[#cccccc]">
                  {t.helpHint}
                </div>
              )}

              <p className="mt-10 text-xs leading-relaxed text-[#737373]">
                {t.recaptchaText}
              </p>

              <div className="mt-6 border-t border-[#262626] pt-4">
                <button
                  type="button"
                  onClick={() => navigateTo('landing')}
                  className="text-xs text-[#8c8c8c] hover:text-white hover:underline transition"
                >
                  ← {t.backToHome}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom subtle text */}
        <div className="relative z-10 pb-6 text-center text-xs text-white/60 font-medium">
          {t.premiereFooter}
        </div>
      </main>
    );
  }

  // LANDING VIEW (Home gate identical to Netflix homepage)
  return (
    <main className="film-grain relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-[#141414] text-white">
      {/* Netflix Movie Poster Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/netflix-login-bg.jpg"
          alt="Manuflix Background"
          className="h-full w-full object-cover object-center scale-105"
        />
        {/* Dark overlay so the background photos look clear and atmospheric */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/85 via-black/20 to-[#141414]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Top Header with MANUFLIX logo, Language selector, and Sign In button */}
      <header
        className="relative z-20 flex w-full items-center justify-between px-6 py-5 sm:px-12 md:px-16 lg:px-24 xl:px-36"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)' }}
      >
        <NetflixStyleLogo />
        <div className="flex items-center gap-3 sm:gap-5">
          <NetflixLanguageSelect lang={lang} onChange={setLang} />
          <button
            type="button"
            data-testid="button-signin-nav"
            onClick={() => navigateTo('signin')}
            className="rounded-[4px] bg-[#E50914] px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition hover:bg-[#c11119] active:scale-95"
          >
            {t.signIn}
          </button>
        </div>
      </header>

      {/* Center Content identical to Netflix */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-[900px] w-full">
          <h1 className="font-sans font-black text-white text-3xl sm:text-5xl md:text-6xl leading-[1.12] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {t.titleLine1}<br /> {t.titleLine2}
          </h1>

          <p className="mt-4 sm:mt-5 text-lg sm:text-2xl font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {t.priceText}
          </p>

          <p className="mt-4 sm:mt-6 text-base sm:text-xl font-normal text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {t.readyText}
          </p>

          {/* Clean Netflix-style Input Row */}
          <form
            onSubmit={submit}
            className={`mt-5 sm:mt-7 mx-auto flex w-full max-w-[580px] flex-col sm:flex-row items-center justify-center gap-3 ${shaking ? 'animate-[shake_.4s_ease-in-out]' : ''}`}
          >
            <div className="relative w-full sm:flex-1">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#E50914]"
              />
              <input
                id="birthday-input"
                data-testid="input-birthday"
                type="date"
                value={birthday}
                onChange={(event) => {
                  setBirthday(event.target.value);
                  setMessage('');
                }}
                className="h-14 w-full rounded-[4px] border border-white/30 bg-[#161616]/80 pl-11 pr-4 text-base text-white outline-none backdrop-blur-md transition focus:border-white focus:ring-1 focus:ring-white [color-scheme:dark]"
              />
            </div>
            <button
              data-testid="button-unlock"
              type="submit"
              className="flex h-14 w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-[4px] bg-[#E50914] px-7 sm:px-8 text-lg sm:text-xl font-semibold text-white transition hover:bg-[#c11119] active:scale-[0.98]"
            >
              {t.getStarted} <ArrowRight size={22} />
            </button>
          </form>

          {message && (
            <p data-testid="status-birthday" className="mt-3 text-sm font-medium text-[#E50914]">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Subtle bottom spacer for balance */}
      <div className="relative z-10 pb-6 text-center text-xs text-white/60 font-medium">
        {t.premiereFooter}
      </div>
    </main>
  );
}

function MemoryModal({ memory, onClose }: { memory: Memory | null; onClose: () => void }) {
  useEffect(() => {
    if (!memory) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [memory, onClose]);
  if (!memory) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09080c]/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article role="dialog" aria-modal="true" aria-labelledby="modal-title" className="gate-reveal relative max-h-[90dvh] w-full max-w-[720px] overflow-y-auto rounded-2xl border border-white/10 bg-[#1e1e1e] shadow-2xl">
        <div className="relative h-[240px] sm:h-[330px]">
          <ImageFrame src={memory.image} alt={memory.title} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-black/20" />
          <button aria-label="Close memory" data-testid="button-close-memory" onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/70"><X size={18} /></button>
          <div className="absolute bottom-5 left-6 right-6 sm:left-9">
            <span className="font-mono-label text-[10px] uppercase tracking-[.2em] text-[#E50914]">{memory.kind}</span>
            <h2 id="modal-title" className="mt-2 font-editorial text-4xl text-[#f5eee6] sm:text-5xl">{memory.title}</h2>
          </div>
        </div>
        <div className="px-6 pb-8 pt-3 sm:px-9">
          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 font-mono-label text-[10px] uppercase tracking-[.11em] text-[#a79da6]">
            <span>{memory.year}</span><span>{memory.runtime}</span><span className="text-[#E50914]">{memory.rating}</span>
          </div>
          <p className="max-w-[570px] text-[15px] leading-7 text-[#ded6d0]">{memory.description}</p>
          <div className="mt-7 border-l border-[#E50914] pl-4">
            <p className="font-editorial text-lg italic leading-relaxed text-[#E50914]">{memory.note}</p>
          </div>
          <button onClick={onClose} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-[#e8e0da] transition hover:border-[#E50914]/70 hover:text-white">Back to the collection <ArrowRight size={14} /></button>
        </div>
      </article>
    </div>
  );
}

function BirthdayNote({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-[#09080c]/85 p-5 backdrop-blur-md" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article className="gate-reveal relative max-w-[490px] rounded-2xl border border-[#E50914]/25 bg-[#1e1e1e] px-7 py-10 text-center shadow-[0_25px_100px_#0009] sm:px-12 sm:py-14">
        <button aria-label="Close birthday message" onClick={onClose} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#a89da4] transition hover:bg-white/10 hover:text-white"><X size={17} /></button>
        <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914]"><Heart size={19} strokeWidth={1.5} /></div>
        <p className="font-mono-label text-[10px] uppercase tracking-[.24em] text-[#E50914]">A note for your new year</p>
        <h2 className="mt-4 font-editorial text-4xl leading-tight text-[#f5eee6]">You make the<br /><span className="italic text-[#E50914]">story better.</span></h2>
        <p className="mt-6 text-sm leading-7 text-[#c8bec4]">I hope today feels like being wrapped up in every good thing you give to everyone around you. You deserve the full, unhurried, best-scene-in-the-movie kind of joy.</p>
        <p className="mt-6 font-editorial text-lg italic text-[#E50914]">Happy birthday. I’m so glad you’re here.</p>
        <button onClick={onClose} className="mt-8 rounded-full bg-[#E50914] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#E50914]/90">Keep the good feeling</button>
      </article>
    </div>
  );
}

function NetflixFullscreenPlayer({
  src = '/movie.mp4',
  title = 'Documentary of Mr.MD',
  subtitle = 'MANUFLIX ORIGINAL',
  onClose,
}: {
  src?: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);
  const [forceLandscape, setForceLandscape] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  // Request fullscreen, attempt orientation lock, and start playback on mount
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;

    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {
          // Autoplay with sound prevented, play muted
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(console.error);
        });
      }
    }

    if (el) {
      if (el.requestFullscreen) {
        el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    }

    // Lock orientation to landscape on mobile devices
    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        (screen.orientation as any).lock('landscape')
          .then(() => setIsLandscapeLocked(true))
          .catch((err: any) => console.log('Orientation lock prevented:', err));
      }
    } catch { }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        seekRelative(-10);
      } else if (e.key === 'ArrowRight') {
        seekRelative(10);
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'm') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch { }
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }
    };
  }, [onClose]);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    resetHideTimer();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
    resetHideTimer();
  };

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds));
    }
    resetHideTimer();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement && el) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => { });
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
    resetHideTimer();
  };

  const toggleOrientationManual = () => {
    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        if (isLandscapeLocked) {
          screen.orientation.unlock();
          setIsLandscapeLocked(false);
          setForceLandscape(false);
        } else {
          (screen.orientation as any).lock('landscape')
            .then(() => setIsLandscapeLocked(true))
            .catch(() => {
              setForceLandscape((prev) => !prev);
            });
        }
      } else {
        setForceLandscape((prev) => !prev);
      }
    } catch {
      setForceLandscape((prev) => !prev);
    }
    resetHideTimer();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
    resetHideTimer();
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={resetHideTimer}
      style={{
        cursor: showControls ? 'default' : 'none',
        ...(forceLandscape ? {
          transform: 'rotate(90deg)',
          transformOrigin: 'bottom left',
          position: 'fixed',
          top: '-100vw',
          left: 0,
          height: '100vw',
          width: '100vh',
          zIndex: 9999,
        } : {})
      }}
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-black select-none"
    >
      {/* Fullscreen Video Element */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        preload="auto"
        onMouseMove={resetHideTimer}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
        onClick={togglePlay}
        className="absolute inset-0 h-full w-full object-contain cursor-pointer"
      />

      {/* Top Header Bar */}
      <div
        className={`relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            title="Exit player (Esc)"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <span className="font-mono-label text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#E50914] font-semibold">
              {subtitle}
            </span>
            <h2 className="text-base sm:text-xl font-bold text-white drop-shadow">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile landscape rotate button */}
          <button
            type="button"
            onClick={toggleOrientationManual}
            className="flex items-center gap-1.5 rounded-[4px] border border-white/25 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:border-white hover:bg-black/80 active:scale-95 sm:hidden"
            title="Rotate to Landscape"
          >
            <Smartphone size={16} className="rotate-90 text-[#E50914]" /> Rotate
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Big Center Quick Action (visible when paused or on tap) */}
      <div
        className={`relative z-10 mx-auto flex items-center justify-center gap-8 sm:gap-14 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); seekRelative(-10); }}
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/80 active:scale-95"
          title="Rewind 10s"
        >
          <RotateCcw size={28} />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#E50914] text-white shadow-2xl transition hover:scale-105 hover:bg-[#c11119] active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={38} fill="white" /> : <Play size={38} fill="white" className="ml-1" />}
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); seekRelative(10); }}
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/80 active:scale-95"
          title="Forward 10s"
        >
          <RotateCw size={28} />
        </button>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`relative z-20 px-4 sm:px-8 pb-5 sm:pb-8 pt-6 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Scrubber Progress Bar */}
        <div className="relative mb-3 flex items-center gap-3">
          <div className="relative flex-1 group py-2 cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
            />
            {/* Background track */}
            <div className="h-1 sm:h-1.5 w-full rounded-full bg-white/30 overflow-hidden group-hover:h-2 transition-all">
              <div
                className="h-full bg-[#E50914] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Scrubber thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-[#E50914] shadow-md transition-transform pointer-events-none group-hover:scale-125"
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>
          <span className="font-mono text-xs sm:text-sm text-white/80 shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-[#E50914] transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>

            <button
              type="button"
              onClick={() => seekRelative(-10)}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition"
              title="Rewind 10s"
            >
              <RotateCcw size={20} />
              <span className="text-[10px] font-bold">10</span>
            </button>

            <button
              type="button"
              onClick={() => seekRelative(10)}
              className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition"
              title="Forward 10s"
            >
              <RotateCw size={20} />
              <span className="text-[10px] font-bold">10</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="text-white hover:text-white/80 transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Mobile rotate button in bottom bar */}
            <button
              type="button"
              onClick={toggleOrientationManual}
              className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition"
              title="Turn landscape"
            >
              <Smartphone size={18} className="rotate-90" />
              <span className="hidden sm:inline text-xs">Landscape</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-white hover:text-white/80 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LudoCelebrationFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#FF1744', // Red
      '#FFD700', // Gold
      '#00E5FF', // Cyan
      '#D500F9', // Purple
      '#FF9100', // Orange
      '#00E676', // Emerald
      '#FF4081', // Pink
      '#FFFF00', // Neon Yellow
      '#FFFFFF', // Sparkle White
    ];

    interface Particle {
      x: number;
      y: number;
      prevX: number;
      prevY: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;
      sparkle: boolean;
    }

    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      color: string;
    }

    interface Rocket {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetY: number;
      color: string;
      trail: { x: number; y: number }[];
    }

    interface Confetti {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      vRot: number;
      width: number;
      height: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    const shockwaves: Shockwave[] = [];
    const rockets: Rocket[] = [];
    const confettis: Confetti[] = [];

    const explode = (x: number, y: number, primaryColor: string) => {
      shockwaves.push({
        x,
        y,
        radius: 3,
        maxRadius: 28 + Math.random() * 16,
        alpha: 0.8,
        color: primaryColor,
      });

      // Lightweight particle count: 26-34 (previously 75-110)
      const count = 26 + Math.floor(Math.random() * 8);
      const isMultiColor = Math.random() > 0.4;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 4.6 + 1.8;
        const color = isMultiColor ? colors[Math.floor(Math.random() * colors.length)] : primaryColor;
        particles.push({
          x,
          y,
          prevX: x,
          prevY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2.2 + 1.4,
          decay: Math.random() * 0.022 + 0.016, // Clean decay clears particles quickly
          sparkle: Math.random() > 0.5,
        });
      }

      // Hard cap to guarantee zero lag:
      if (particles.length > 70) {
        particles.splice(0, particles.length - 70);
      }

      // Light confetti: 2-3 pieces
      for (let i = 0; i < 3; i++) {
        confettis.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3.2,
          vy: Math.random() * -2.2 - 1,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 8,
          width: Math.random() * 5 + 4,
          height: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
        });
      }
      if (confettis.length > 20) {
        confettis.splice(0, confettis.length - 20);
      }
      if (shockwaves.length > 3) {
        shockwaves.splice(0, shockwaves.length - 3);
      }
    };

    const launchRocket = (startX?: number, targetApexY?: number) => {
      if (width <= 0 || height <= 0) return;
      const x = startX !== undefined ? startX : Math.random() * (width * 0.82) + width * 0.09;
      const targetY = targetApexY !== undefined ? targetApexY : Math.random() * (height * 0.48) + height * 0.1;
      const speed = Math.random() * 3.5 + 9;
      const angle = (Math.random() - 0.5) * 0.18;
      rockets.push({
        x,
        y: height + 8,
        vx: Math.sin(angle) * 2,
        vy: -speed,
        targetY,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    };

    // Initial festive burst: single rocket, then one more
    setTimeout(() => {
      launchRocket(width * 0.35, height * 0.26);
      setTimeout(() => launchRocket(width * 0.65, height * 0.22), 650);
    }, 200);

    let lastLaunch = 0;

    const loop = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth throttle: 1 rocket every ~1.0 to 1.5 seconds (no stutter/lag)
      if (timestamp - lastLaunch > 1100 + Math.random() * 500) {
        lastLaunch = timestamp;
        launchRocket();
      }

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.2 + 1.2;
        sw.alpha -= 0.045;
        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2 * sw.alpha;
        ctx.globalAlpha = sw.alpha * 0.7;
        ctx.stroke();
        ctx.restore();
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 5) r.trail.shift(); // Lightweight short trail

        for (let j = 0; j < r.trail.length; j++) {
          const pt = r.trail[j];
          const a = (j + 1) / r.trail.length;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2 * a, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 210, 60, ${a * 0.8})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        if (r.y <= r.targetY || r.y <= 15) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.prevX = p.x;
        p.prevY = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        const flicker = p.sparkle && Math.random() > 0.4 ? 0.45 : 1;
        ctx.globalAlpha = Math.max(0, p.alpha * flicker);
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = confettis.length - 1; i >= 0; i--) {
        const c = confettis[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.045;
        c.vx *= 0.985;
        c.rotation += c.vRot;
        c.alpha -= 0.012;

        if (c.alpha <= 0 || c.y > height + 20) {
          confettis.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, c.alpha);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      launchRocket(clickX, clickY);
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('click', handleCanvasClick);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (parent) {
        parent.removeEventListener('click', handleCanvasClick);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full z-0"
    />
  );
}

function CelebrationBalloons({ showLeftBouquet = true }: { showLeftBouquet?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="balloonRed" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ff7b82" />
            <stop offset="35%" stopColor="#E50914" />
            <stop offset="85%" stopColor="#8f060d" />
            <stop offset="100%" stopColor="#520005" />
          </radialGradient>
          <radialGradient id="balloonGold" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#fff7bd" />
            <stop offset="35%" stopColor="#FFB703" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#632504" />
          </radialGradient>
          <radialGradient id="balloonPurple" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#e9b8ff" />
            <stop offset="35%" stopColor="#9D4EDD" />
            <stop offset="85%" stopColor="#5a189a" />
            <stop offset="100%" stopColor="#240046" />
          </radialGradient>
          <radialGradient id="balloonCyan" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#a3f0ff" />
            <stop offset="35%" stopColor="#00B4D8" />
            <stop offset="85%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#03045E" />
          </radialGradient>
          <radialGradient id="balloonGreen" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="35%" stopColor="#10B981" />
            <stop offset="85%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
          <radialGradient id="balloonPink" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="35%" stopColor="#EC4899" />
            <stop offset="85%" stopColor="#BE185D" />
            <stop offset="100%" stopColor="#700733" />
          </radialGradient>
          <radialGradient id="balloonOrange" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="35%" stopColor="#F97316" />
            <stop offset="85%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#7C2D12" />
          </radialGradient>
        </defs>
      </svg>

      {/* 🎈 BOUQUET 1: Left Cluster (Only shown when not revealed so text is never covered) */}
      {showLeftBouquet && (
        <div className="absolute -left-3 sm:left-3 bottom-8 sm:bottom-12 scale-80 sm:scale-90 origin-bottom-left animate-float-slow hidden sm:block">
          <svg width="170" height="270" viewBox="0 0 170 270" fill="none">
            <g transform="translate(18, 55)">
              <ellipse cx="32" cy="40" rx="27" ry="36" fill="url(#balloonPurple)" filter="drop-shadow(0 6px 14px rgba(157,78,221,0.4))" />
              <ellipse cx="23" cy="26" rx="7" ry="12" fill="white" fillOpacity="0.45" transform="rotate(-25 23 26)" />
              <polygon points="28,75 36,75 32,71" fill="#5a189a" />
              <path d="M 32 75 Q 46 115 56 160 T 68 205" stroke="#e9b8ff" strokeWidth="1.4" strokeOpacity="0.6" fill="none" />
            </g>
            <g transform="translate(75, 45)">
              <ellipse cx="32" cy="40" rx="28" ry="38" fill="url(#balloonCyan)" filter="drop-shadow(0 6px 14px rgba(0,180,216,0.4))" />
              <ellipse cx="23" cy="26" rx="7" ry="12" fill="white" fillOpacity="0.45" transform="rotate(-25 23 26)" />
              <polygon points="28,77 36,77 32,73" fill="#0077B6" />
              <path d="M 32 77 Q 25 120 45 160 T 68 205" stroke="#a3f0ff" strokeWidth="1.4" strokeOpacity="0.6" fill="none" />
            </g>
            <g transform="translate(6, 15)">
              <ellipse cx="36" cy="46" rx="31" ry="42" fill="url(#balloonGold)" filter="drop-shadow(0 8px 18px rgba(255,183,3,0.4))" />
              <ellipse cx="26" cy="30" rx="8" ry="14" fill="white" fillOpacity="0.5" transform="rotate(-25 26 30)" />
              <polygon points="32,87 40,87 36,83" fill="#b45309" />
              <path d="M 36 87 Q 52 130 60 168 T 68 205" stroke="#fcd34d" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
            </g>
            <g transform="translate(68, 10)">
              <ellipse cx="34" cy="44" rx="29" ry="39" fill="url(#balloonGreen)" filter="drop-shadow(0 8px 18px rgba(16,185,129,0.35))" />
              <ellipse cx="24" cy="28" rx="7" ry="13" fill="white" fillOpacity="0.45" transform="rotate(-25 24 28)" />
              <polygon points="30,82 38,82 34,78" fill="#047857" />
              <path d="M 34 82 Q 45 125 58 165 T 68 205" stroke="#a7f3d0" strokeWidth="1.5" strokeOpacity="0.65" fill="none" />
            </g>
            <g transform="translate(35, 0)">
              <ellipse cx="40" cy="52" rx="35" ry="48" fill="url(#balloonRed)" filter="drop-shadow(0 10px 22px rgba(229,9,20,0.5))" />
              <ellipse cx="28" cy="34" rx="9" ry="16" fill="white" fillOpacity="0.5" transform="rotate(-25 28 34)" />
              <polygon points="36,99 44,99 40,95" fill="#8f060d" />
              <path d="M 40 99 Q 54 135 62 170 T 68 205" stroke="#ff7b82" strokeWidth="1.6" strokeOpacity="0.8" fill="none" />
            </g>
            <circle cx="68" cy="205" r="4" fill="#FFD700" />
            <path d="M 68 205 Q 60 225 52 250" stroke="#FFD700" strokeWidth="1.6" fill="none" />
            <path d="M 68 205 Q 75 228 82 255" stroke="#FFD700" strokeWidth="1.6" fill="none" />
          </svg>
        </div>
      )}

      {/* 🎈 BOUQUET 2: Right Cluster */}
      <div className="absolute right-1 sm:right-6 top-6 sm:top-10 animate-float-reverse hidden sm:block">
        <svg width="170" height="270" viewBox="0 0 170 270" fill="none">
          <g transform="translate(15, 45)">
            <ellipse cx="32" cy="40" rx="27" ry="36" fill="url(#balloonCyan)" filter="drop-shadow(0 6px 14px rgba(0,180,216,0.35))" />
            <ellipse cx="23" cy="26" rx="7" ry="12" fill="white" fillOpacity="0.45" transform="rotate(-25 23 26)" />
            <polygon points="28,75 36,75 32,71" fill="#0077B6" />
            <path d="M 32 75 Q 48 115 62 160 T 72 205" stroke="#a3f0ff" strokeWidth="1.4" strokeOpacity="0.6" fill="none" />
          </g>
          <g transform="translate(74, 50)">
            <ellipse cx="32" cy="40" rx="28" ry="37" fill="url(#balloonOrange)" filter="drop-shadow(0 6px 14px rgba(249,115,22,0.4))" />
            <ellipse cx="23" cy="26" rx="7" ry="12" fill="white" fillOpacity="0.45" transform="rotate(-25 23 26)" />
            <polygon points="28,76 36,76 32,72" fill="#C2410C" />
            <path d="M 32 76 Q 38 120 54 165 T 72 205" stroke="#fed7aa" strokeWidth="1.4" strokeOpacity="0.6" fill="none" />
          </g>
          <g transform="translate(8, 12)">
            <ellipse cx="35" cy="45" rx="30" ry="40" fill="url(#balloonPink)" filter="drop-shadow(0 8px 18px rgba(236,72,153,0.4))" />
            <ellipse cx="25" cy="30" rx="8" ry="14" fill="white" fillOpacity="0.5" transform="rotate(-25 25 30)" />
            <polygon points="31,84 39,84 35,80" fill="#BE185D" />
            <path d="M 35 84 Q 50 128 62 165 T 72 205" stroke="#fbcfe8" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
          </g>
          <g transform="translate(68, 8)">
            <ellipse cx="36" cy="46" rx="31" ry="42" fill="url(#balloonRed)" filter="drop-shadow(0 8px 18px rgba(229,9,20,0.45))" />
            <ellipse cx="26" cy="30" rx="8" ry="14" fill="white" fillOpacity="0.5" transform="rotate(-25 26 30)" />
            <polygon points="32,87 40,87 36,83" fill="#8f060d" />
            <path d="M 36 87 Q 48 130 64 168 T 72 205" stroke="#ff7b82" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
          </g>
          <g transform="translate(36, 0)">
            <ellipse cx="38" cy="50" rx="34" ry="46" fill="url(#balloonGold)" filter="drop-shadow(0 10px 22px rgba(255,183,3,0.5))" />
            <ellipse cx="27" cy="32" rx="9" ry="15" fill="white" fillOpacity="0.55" transform="rotate(-25 27 32)" />
            <polygon points="34,95 42,95 38,91" fill="#b45309" />
            <path d="M 38 95 Q 52 135 62 170 T 72 205" stroke="#fcd34d" strokeWidth="1.6" strokeOpacity="0.8" fill="none" />
          </g>
          <circle cx="72" cy="205" r="4" fill="#FF1744" />
          <path d="M 72 205 Q 64 225 56 252" stroke="#FF1744" strokeWidth="1.6" fill="none" />
          <path d="M 72 205 Q 80 228 88 255" stroke="#FF1744" strokeWidth="1.6" fill="none" />
        </svg>
      </div>

      {/* Floating Individual Balloons (Kept away from top-left text) */}
      <div className="absolute left-[3%] -top-4 scale-75 opacity-30 animate-float-slow hidden lg:block" style={{ animationDelay: '1.2s' }}>
        <svg width="68" height="150" viewBox="0 0 68 150" fill="none">
          <ellipse cx="34" cy="38" rx="25" ry="34" fill="url(#balloonPurple)" filter="drop-shadow(0 6px 12px rgba(157,78,221,0.35))" />
          <ellipse cx="25" cy="25" rx="6" ry="11" fill="white" fillOpacity="0.45" transform="rotate(-25 25 25)" />
          <polygon points="30,71 38,71 34,67" fill="#5a189a" />
          <path d="M 34 71 Q 25 98 42 122 T 32 148" stroke="#e9b8ff" strokeWidth="1.3" strokeOpacity="0.6" fill="none" />
        </svg>
      </div>

      <div className="absolute left-[44%] top-1 animate-float-reverse opacity-85 hidden lg:block" style={{ animationDelay: '2.5s' }}>
        <svg width="68" height="150" viewBox="0 0 68 150" fill="none">
          <ellipse cx="34" cy="38" rx="26" ry="35" fill="url(#balloonGold)" filter="drop-shadow(0 6px 12px rgba(255,183,3,0.35))" />
          <ellipse cx="25" cy="25" rx="6" ry="11" fill="white" fillOpacity="0.5" transform="rotate(-25 25 25)" />
          <polygon points="30,72 38,72 34,68" fill="#b45309" />
          <path d="M 34 72 Q 44 100 26 124 T 36 148" stroke="#fcd34d" strokeWidth="1.3" strokeOpacity="0.6" fill="none" />
        </svg>
      </div>

      <div className="absolute right-[24%] top-4 animate-float-slow opacity-80 hidden md:block" style={{ animationDelay: '0.7s' }}>
        <svg width="65" height="145" viewBox="0 0 65 145" fill="none">
          <ellipse cx="32" cy="36" rx="24" ry="33" fill="url(#balloonCyan)" filter="drop-shadow(0 6px 12px rgba(0,180,216,0.35))" />
          <ellipse cx="23" cy="23" rx="6" ry="10" fill="white" fillOpacity="0.45" transform="rotate(-25 23 23)" />
          <polygon points="28,68 36,68 32,64" fill="#0077B6" />
          <path d="M 32 68 Q 24 95 38 120 T 30 144" stroke="#a3f0ff" strokeWidth="1.3" strokeOpacity="0.6" fill="none" />
        </svg>
      </div>

      <div className="absolute left-3 sm:left-10 bottom-8 animate-float-reverse opacity-75 hidden sm:block" style={{ animationDelay: '3.1s' }}>
        <svg width="65" height="140" viewBox="0 0 65 140" fill="none">
          <ellipse cx="32" cy="36" rx="24" ry="33" fill="url(#balloonGreen)" filter="drop-shadow(0 6px 12px rgba(16,185,129,0.3))" />
          <ellipse cx="23" cy="23" rx="6" ry="10" fill="white" fillOpacity="0.45" transform="rotate(-25 23 23)" />
          <polygon points="28,68 36,68 32,64" fill="#047857" />
          <path d="M 32 68 Q 40 95 24 118 T 32 138" stroke="#a7f3d0" strokeWidth="1.3" strokeOpacity="0.55" fill="none" />
        </svg>
      </div>

      <div className="absolute right-4 sm:right-12 bottom-10 animate-float-slow opacity-75 hidden sm:block" style={{ animationDelay: '1.9s' }}>
        <svg width="65" height="140" viewBox="0 0 65 140" fill="none">
          <ellipse cx="32" cy="36" rx="24" ry="33" fill="url(#balloonPink)" filter="drop-shadow(0 6px 12px rgba(236,72,153,0.3))" />
          <ellipse cx="23" cy="23" rx="6" ry="10" fill="white" fillOpacity="0.45" transform="rotate(-25 23 23)" />
          <polygon points="28,68 36,68 32,64" fill="#BE185D" />
          <path d="M 32 68 Q 22 95 38 118 T 28 138" stroke="#fbcfe8" strokeWidth="1.3" strokeOpacity="0.55" fill="none" />
        </svg>
      </div>
    </div>
  );
}

function BirthdayCakeWithCandles({ lit }: { lit: boolean }) {
  return (
    <div className="relative mx-auto flex flex-col items-center select-none py-2">
      <div className="absolute bottom-2 h-14 w-64 rounded-full bg-[#E50914]/30 blur-xl pointer-events-none" />

      <svg width="280" height="230" viewBox="0 0 280 230" className="drop-shadow-2xl overflow-visible">
        <defs>
          <radialGradient id="cakePlate" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="70%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </radialGradient>
          <linearGradient id="cakeTier1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="30%" stopColor="#92400e" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="cakeTier2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E50914" />
            <stop offset="35%" stopColor="#ff4d58" />
            <stop offset="70%" stopColor="#E50914" />
            <stop offset="100%" stopColor="#8f060d" />
          </linearGradient>
          <linearGradient id="frostingCream" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF3C4" />
          </linearGradient>
          <linearGradient id="candleStick" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFF9C4" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>
          <radialGradient id="flameGlow" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FFEE58" />
            <stop offset="65%" stopColor="#FF9100" />
            <stop offset="100%" stopColor="#FF1744" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Serving Platter */}
        <ellipse cx="140" cy="210" rx="120" ry="16" fill="url(#cakePlate)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.6))" />
        <ellipse cx="140" cy="207" rx="112" ry="12" fill="#e5e7eb" opacity="0.6" />

        {/* Bottom Tier (Chocolate base) */}
        <path d="M 45 155 Q 140 178 235 155 L 235 198 Q 140 220 45 198 Z" fill="url(#cakeTier1)" />
        <ellipse cx="140" cy="155" rx="95" ry="18" fill="#a16207" />

        {/* Bottom Tier Frosting Drips */}
        <path d="M 45 155 C 55 175, 62 175, 70 158 C 80 180, 90 182, 100 159 C 112 186, 122 188, 134 160 C 148 186, 158 184, 168 160 C 180 180, 190 182, 202 158 C 214 178, 224 175, 235 155 Z" fill="url(#frostingCream)" />

        {[60, 92, 126, 156, 190, 220].map((x, i) => (
          <circle key={i} cx={x} cy={165 + Math.sin(i) * 3} r="3.5" fill="#E50914" />
        ))}

        {/* Top Tier (Netflix Red Frosting) */}
        <path d="M 75 108 Q 140 126 205 108 L 205 148 Q 140 166 75 148 Z" fill="url(#cakeTier2)" />
        <ellipse cx="140" cy="108" rx="65" ry="14" fill="#ff7b82" />

        <path d="M 75 108 C 86 126, 94 126, 104 112 C 114 130, 124 130, 136 113 C 148 132, 158 130, 170 112 C 182 126, 194 126, 205 108 Z" fill="url(#frostingCream)" />

        {/* Number 27 Gold Plate */}
        <g transform="translate(112, 120)">
          <rect x="0" y="0" width="56" height="22" rx="11" fill="#141414" stroke="#FFD700" strokeWidth="1.5" />
          <text x="28" y="15" textAnchor="middle" fill="#FFD700" fontSize="11" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">
            27 ✨
          </text>
        </g>

        {/* Candle 1 (Left) */}
        <g transform="translate(108, 62)">
          <rect x="-4" y="10" width="8" height="36" rx="2" fill="url(#candleStick)" />
          <line x1="0" y1="10" x2="0" y2="4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          {lit ? (
            <g className="animate-flame">
              <circle cx="0" cy="0" r="14" fill="url(#flameGlow)" opacity="0.6" />
              <path d="M 0 4 Q -6 -3, 0 -14 Q 6 -3, 0 4 Z" fill="url(#flameGlow)" />
              <path d="M 0 2 Q -3 -2, 0 -8 Q 3 -2, 0 2 Z" fill="#FFFFFF" />
            </g>
          ) : (
            <g className="animate-smoke">
              <path d="M 0 2 Q 4 -8, -2 -16 T 2 -26" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Candle 2 (Center Hero) */}
        <g transform="translate(140, 56)">
          <rect x="-4.5" y="10" width="9" height="42" rx="2" fill="url(#candleStick)" />
          <line x1="0" y1="10" x2="0" y2="3" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          {lit ? (
            <g className="animate-flame" style={{ animationDelay: '0.18s' }}>
              <circle cx="0" cy="-2" r="16" fill="url(#flameGlow)" opacity="0.75" />
              <path d="M 0 3 Q -7 -5, 0 -17 Q 7 -5, 0 3 Z" fill="url(#flameGlow)" />
              <path d="M 0 1 Q -3.5 -3, 0 -10 Q 3.5 -3, 0 1 Z" fill="#FFFFFF" />
            </g>
          ) : (
            <g className="animate-smoke" style={{ animationDelay: '0.1s' }}>
              <path d="M 0 2 Q -4 -10, 3 -18 T -2 -30" stroke="#9ca3af" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Candle 3 (Right) */}
        <g transform="translate(172, 62)">
          <rect x="-4" y="10" width="8" height="36" rx="2" fill="url(#candleStick)" />
          <line x1="0" y1="10" x2="0" y2="4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          {lit ? (
            <g className="animate-flame" style={{ animationDelay: '0.35s' }}>
              <circle cx="0" cy="0" r="14" fill="url(#flameGlow)" opacity="0.6" />
              <path d="M 0 4 Q -6 -3, 0 -14 Q 6 -3, 0 4 Z" fill="url(#flameGlow)" />
              <path d="M 0 2 Q -3 -2, 0 -8 Q 3 -2, 0 2 Z" fill="#FFFFFF" />
            </g>
          ) : (
            <g className="animate-smoke" style={{ animationDelay: '0.2s' }}>
              <path d="M 0 2 Q 5 -7, -3 -17 T 3 -28" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

function DedicationStarfield() {
  const snowfallFlakes = [
    { left: '44%', size: 3.5, delay: '0s', duration: '7.5s', color: '#FFE066', glow: 6 },
    { left: '48%', size: 2.5, delay: '2.1s', duration: '8.2s', color: '#FFFFFF', glow: 5 },
    { left: '52%', size: 3.5, delay: '4.3s', duration: '9s', color: '#FFD700', glow: 8 },
    { left: '55%', size: 2, delay: '1.2s', duration: '6.8s', color: '#00E5FF', glow: 5 },
    { left: '58%', size: 3, delay: '5.5s', duration: '8.5s', color: '#FF9100', glow: 6 },
    { left: '50%', size: 4, delay: '3.4s', duration: '7.8s', color: '#FFFFFF', glow: 7 },
    { left: '53%', size: 2.5, delay: '6.2s', duration: '9.2s', color: '#FFE066', glow: 5 },
    { left: '46%', size: 3.5, delay: '1.8s', duration: '8s', color: '#FFD700', glow: 7 },
    { left: '60%', size: 2, delay: '4.9s', duration: '7.2s', color: '#00E5FF', glow: 4 },
    { left: '32%', size: 2.5, delay: '2.8s', duration: '8.4s', color: '#FFE066', glow: 5 },
    { left: '40%', size: 3, delay: '5.1s', duration: '9s', color: '#FFFFFF', glow: 6 },
    { left: '65%', size: 3, delay: '0.9s', duration: '7.6s', color: '#FFD700', glow: 7 },
    { left: '72%', size: 2.5, delay: '3.6s', duration: '8.6s', color: '#FFE066', glow: 5 },
    { left: '80%', size: 3.5, delay: '6.0s', duration: '9.4s', color: '#FF9100', glow: 8 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* ❄️ Falling Stardust Snowfall */}
      {snowfallFlakes.map((f, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-snowfall"
          style={{
            left: f.left,
            top: '-20px',
            width: `${f.size}px`,
            height: `${f.size}px`,
            backgroundColor: f.color,
            boxShadow: `0 0 ${f.glow}px ${f.color}`,
            animationDelay: f.delay,
            animationDuration: f.duration,
          }}
        />
      ))}

      {/* 🌟 Middle Center Gap Spinning Star Cluster (Fills the space between left text & right photo) */}
      <div className="absolute left-[53%] top-1/2 -translate-y-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-8 opacity-95">
        <div className="animate-star-spin-pulse text-[#FFD700] text-3xl drop-shadow-[0_0_16px_rgba(255,215,0,0.9)]">
          ✦
        </div>
        <div className="animate-sparkle-spin text-[#00E5FF] text-2xl drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]" style={{ animationDelay: '1.2s' }}>
          ✨
        </div>
        <div className="animate-star-spin-pulse text-[#FFE066] text-4xl drop-shadow-[0_0_24px_rgba(255,224,102,0.95)]" style={{ animationDelay: '2.5s' }}>
          ⭐
        </div>
        <div className="animate-sparkle-spin text-[#FF4D4D] text-2xl drop-shadow-[0_0_10px_rgba(255,77,77,0.8)]" style={{ animationDelay: '0.8s' }}>
          ✧
        </div>
        <div className="animate-star-spin-pulse text-[#FFB703] text-3xl drop-shadow-[0_0_14px_rgba(255,183,3,0.85)]" style={{ animationDelay: '3.1s' }}>
          ✨
        </div>
      </div>

      {/* Shimmering ambient stars around middle area */}
      <div className="absolute left-[45%] top-8 text-[#FFE066] text-2xl animate-star-spin-pulse opacity-90">
        ✨
      </div>
      <div className="absolute left-[56%] top-12 text-[#FFD700] text-xl animate-sparkle-spin opacity-85" style={{ animationDelay: '1.7s' }}>
        ✦
      </div>
      <div className="absolute left-[48%] bottom-10 text-[#00E5FF] text-2xl animate-star-spin-pulse opacity-85" style={{ animationDelay: '2.2s' }}>
        ✧
      </div>
      <div className="absolute left-[58%] bottom-16 text-[#FFE066] text-3xl animate-sparkle-spin opacity-90" style={{ animationDelay: '0.5s' }}>
        ⭐
      </div>
    </div>
  );
}

function Collection({ onLock }: { onLock?: () => void }) {
  const [activeCategory, setActiveCategory] = useState('All memories');
  const [selected, setSelected] = useState<Memory | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [fullPlayerOpen, setFullPlayerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [celebrationStep, setCelebrationStep] = useState<'invite' | 'cake' | 'happy_birthday' | 'revealed'>('invite');
  const [candlesLit, setCandlesLit] = useState(true);
  const visibleMemories = useMemo(() => activeCategory === 'All memories' ? memories : memories.filter((memory) => memory.category === activeCategory), [activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBlowCandles = () => {
    setCandlesLit(false);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch {
      // AudioContext fallback
    }

    setTimeout(() => {
      setCelebrationStep('happy_birthday');
    }, 850);
  };

  function chooseCategory(category: string) {
    setActiveCategory(category);
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="film-grain min-h-[100dvh] overflow-hidden bg-[#141414] text-[#f3eee7]">
      {/* Fullscreen Video Player Modal */}
      {fullPlayerOpen && (
        <NetflixFullscreenPlayer
          src="/movie.mp4"
          title="Documentary of Mr.MD"
          subtitle="MANUFLIX ORIGINAL"
          onClose={() => setFullPlayerOpen(false)}
        />
      )}

      {/* Netflix transparent header: transparent at top over video/image, darkens only on scroll */}
      <header className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-[#141414]/95 backdrop-blur-md border-b border-white/[.08] shadow-lg' : 'bg-gradient-to-b from-black/80 via-black/20 to-transparent'}`}>
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 sm:px-9 lg:px-14">
          <div className="flex items-center gap-8">
            <a href="#top" aria-label="Manuflix home" className="font-editorial text-[25px] tracking-[-.06em] text-[#f5eee6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Manu<span className="italic text-[#E50914]">flix</span></a>
          </div>

          {/* Right side: Mini profile avatar icon — clicks to go to very first login page */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onLock}
              data-testid="button-switch-profile"
              title="Switch user / Log in again"
              className="flex items-center gap-2 rounded-[4px] transition hover:opacity-90 active:scale-95 group focus:outline-none"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-[4px] bg-[#E50914] overflow-hidden flex items-center justify-center shadow-lg border border-white/30 group-hover:border-white group-hover:ring-2 group-hover:ring-white/50 transition">
                <svg viewBox="0 0 32 32" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor">
                  {/* Netflix classic smiley avatar */}
                  <circle cx="11" cy="12" r="2.5" />
                  <circle cx="21" cy="12" r="2.5" />
                  <path d="M 9 20 Q 16 26 23 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="relative min-h-[90vh] pt-[68px]">
        {/* Full-bleed background thumbnail image with authentic Netflix Stranger Things visual combination */}
        <div className="absolute inset-0 overflow-hidden bg-[#141414]">
          <img
            src="/imgs/hero-thumbnail-flipped.jpeg"
            alt="Documentary of Mr.MD"
            className="h-full w-full object-cover object-[right_center] sm:object-[85%_center] filter brightness-[1.12] contrast-[1.05] saturate-[1.05]"
          />
          {/* Left-side dark vignette: strictly covers only the left text area, leaving Manu completely clear and bright on the right */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full sm:w-[58%] lg:w-[48%] bg-gradient-to-r from-[#141414] from-[35%] via-[#141414]/85 via-[70%] to-transparent" />
          {/* Subtle top dark gradient for header */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#141414]/80 to-transparent" />
          {/* Subtle bottom fade into collection */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#141414] to-transparent" />
        </div>

        {/* Netflix Right-Side Rating Badge (like TV-14 in reference image) */}
        <div className="absolute right-0 bottom-24 z-20 hidden sm:flex items-center">
          <div className="border-l-[3px] border-white/80 bg-black/60 pl-3.5 pr-6 py-1 text-sm font-semibold tracking-wider text-white backdrop-blur-sm shadow-lg">
            TV-14
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[calc(90vh-68px)] max-w-[1440px] items-end px-5 pb-[12%] sm:px-9 lg:items-center lg:pb-0 lg:px-14">
          <div className="fade-up max-w-[620px]">
            {/* M SERIES badge */}
            <div className="mb-5 flex items-center gap-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[3px] bg-[#E50914] font-editorial text-[22px] font-bold leading-none text-white" style={{ fontStyle: 'normal' }}>M</span>
              <span className="text-[13px] font-medium tracking-[.35em] text-[#bcb3ba]" style={{ letterSpacing: '.35em' }}>S E R I E S</span>
            </div>

            {/* Big cinematic title with drop shadow */}
            <h1 className="font-editorial text-[clamp(2.2rem,6vw,4.8rem)] uppercase leading-[.95] tracking-[.04em] text-[#f7f0e9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]" style={{ fontWeight: 600, fontStyle: 'normal' }}>
              <span className="block whitespace-nowrap">Documentary</span>
              <span className="block whitespace-nowrap text-[#f7f0e9]">of <span className="text-[#E50914]">Mr.MD</span></span>
            </h1>

            {/* #1 in TV Shows Today badge matching reference image */}
            <div className="mt-5 flex items-center gap-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="flex flex-col items-center justify-center rounded-[2px] bg-[#E50914] px-1 py-0.5 text-[9px] font-black uppercase text-white leading-tight tracking-tighter">
                <span>TOP</span>
                <span className="-mt-0.5">10</span>
              </span>
              <span className="text-[15px] font-bold text-white drop-shadow">#1 in TV Shows Today</span>
            </div>

            {/* Description with drop shadow */}
            <p className="mt-5 max-w-[500px] text-[15px] leading-relaxed text-[#ffffff]/95 sm:text-base drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              A documentary of Manu, who turns 27 this year — a journey shaped by curiosity, a passion for trekking, a love for books, and an endless desire to explore the unknown.
            </p>

            {/* Play & More Info buttons matching reference image */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFullPlayerOpen(true)}
                data-testid="button-play-feature"
                className="inline-flex h-[42px] items-center gap-2.5 rounded-[4px] bg-white px-7 text-[16px] font-bold text-black shadow-xl transition-all duration-200 hover:bg-white/80 active:scale-95 cursor-pointer"
              >
                <Play size={20} fill="black" stroke="black" />
                Play
              </button>
              <button
                onClick={() => setNoteOpen(true)}
                className="inline-flex h-[42px] items-center gap-2.5 rounded-[4px] bg-[#6d6d6e]/70 px-6 text-[16px] font-semibold text-white transition hover:bg-[#6d6d6e]/50 backdrop-blur-sm active:scale-95 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                More info
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#E50914]/45 to-transparent sm:left-10 sm:right-10" />
      </section>

      <section id="collection" className="scroll-mt-20 relative mx-auto max-w-[1440px] px-5 pb-20 pt-11 sm:px-9 sm:pt-14 lg:px-14">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono-label text-[9px] uppercase tracking-[.24em] text-[#E50914]">Handpicked, just for you</p>
            <h2 className="font-editorial text-3xl text-[#f1e9e1] sm:text-[38px]">Your collection <span className="ml-2 align-middle font-sans text-xs font-normal tracking-normal text-[#827983]">({visibleMemories.length} little stories)</span></h2>
          </div>
          <div className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {categories.map((category) => <button key={category} data-testid={`filter-${category.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full border px-4 py-2 text-[11px] transition ${activeCategory === category ? 'border-[#E50914]/80 bg-[#E50914]/15 text-white' : 'border-white/10 text-[#aaa1a8] hover:border-[#E50914]/60 hover:text-white'}`}>{category}</button>)}
          </div>
        </div>



        {visibleMemories.length > 0 ? <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMemories.map((memory, index) => <button key={memory.id} data-testid={`card-memory-${memory.id}`} onClick={() => setSelected(memory)} className="memory-card group min-w-0 text-left" style={{ animationDelay: `${index * 70}ms` }}>
            <div className="relative aspect-[1.64/1] overflow-hidden rounded-xl border border-white/[.08] bg-[#1e1e1e]">
              <ImageFrame src={memory.image} alt={memory.title} className="h-full w-full" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(0deg, ${memory.accent}5c, transparent 70%)` }} />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#141414]/70 px-3 py-1 font-mono-label text-[9px] uppercase tracking-[.12em] text-[#f0e8e1] backdrop-blur-sm">{memory.category}</span>
              <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/45 bg-[#141414]/70 text-white opacity-0 backdrop-blur-sm transition-all group-hover:translate-y-0 group-hover:opacity-100"><Play size={15} fill="currentColor" /></span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div><h3 className="font-editorial text-[21px] text-[#f0e8e1] transition group-hover:text-[#E50914]">{memory.title}</h3><p className="mt-1.5 text-xs leading-relaxed text-[#98909a]">{memory.kind}</p></div>
              <span className="mt-1 shrink-0 font-mono-label text-[9px] text-[#a89ca3]">{memory.rating}</span>
            </div>
          </button>)}
        </div> : <div className="rounded-xl border border-white/10 bg-white/[.025] px-6 py-14 text-center"><Film className="mx-auto text-[#E50914]" size={23} /><p className="mt-4 font-editorial text-2xl">A story still being written.</p><p className="mt-2 text-sm text-[#a79da6]">This shelf is waiting for its first memory.</p></div>}
      </section>

      <section id="dedication" className="relative overflow-hidden border-y border-white/[.07] bg-[#141414] min-h-[580px] flex items-center justify-center">
        {/* Ambient background glow */}
        <div className="absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#E5091418] blur-[120px] pointer-events-none" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-white/[0.03] blur-[100px] pointer-events-none" />

        {/* 🎆 Ludo Victory Fireworks Canvas (ONLY during grand happy_birthday celebration) */}
        {celebrationStep === 'happy_birthday' && (
          <LudoCelebrationFireworks />
        )}

        {/* 🎈 Vibrant 3D Balloons (Active during cake, happy_birthday, and softly framing revealed) */}
        {celebrationStep !== 'invite' && (
          <CelebrationBalloons showLeftBouquet={celebrationStep !== 'revealed'} />
        )}

        {/* 2 Festive Fireworks Bursts (Left & Right - only during cake & happy_birthday celebration) */}
        {(celebrationStep === 'cake' || celebrationStep === 'happy_birthday') && (
          <>
            <div className="pointer-events-none absolute left-[8%] sm:left-[12%] top-6 h-44 w-44 opacity-80 animate-firework-burst z-0">
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <radialGradient id="fw-gold-1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFE066" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="14" fill="url(#fw-gold-1)" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <g key={deg} transform={`rotate(${deg} 100 100)`}>
                    <line x1="100" y1="78" x2="100" y2="30" stroke="#FFE066" strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
                    <circle cx="100" cy="22" r="3" fill="#E50914" />
                    <circle cx="100" cy="40" r="2" fill="#F59E0B" />
                  </g>
                ))}
              </svg>
            </div>

            <div className="pointer-events-none absolute right-[8%] sm:right-[10%] top-4 h-48 w-48 opacity-75 animate-firework-burst z-0" style={{ animationDelay: '1.8s' }}>
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <radialGradient id="fw-red-1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#E50914" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="16" fill="url(#fw-red-1)" />
                {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
                  <g key={deg} transform={`rotate(${deg} 100 100)`}>
                    <line x1="100" y1="72" x2="100" y2="24" stroke="#FF4D4D" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
                    <circle cx="100" cy="16" r="3" fill="#FFE066" />
                    <circle cx="100" cy="34" r="2" fill="#E50914" />
                  </g>
                ))}
              </svg>
            </div>
          </>
        )}

        {/* Sparkle Stars */}
        <div className="pointer-events-none absolute left-[45%] top-12 text-[#FFE066] text-xl animate-sparkle-spin opacity-80 select-none">✨</div>
        <div className="pointer-events-none absolute right-[35%] bottom-16 text-[#FF4D4D] text-lg animate-sparkle-spin opacity-75 select-none" style={{ animationDelay: '2s' }}>⭐</div>
        <div className="pointer-events-none absolute left-[28%] bottom-10 text-[#F59E0B] text-base animate-sparkle-spin opacity-70 select-none" style={{ animationDelay: '1s' }}>✨</div>

        {/* 🌟 STEP 1: INVITE GATE ("Let's Celebrate Your Birthday?") */}
        {celebrationStep === 'invite' && (
          <div className="relative mx-auto max-w-[850px] px-5 py-24 text-center z-10 w-full animate-celebrate-zoom">
            <h2 className="font-editorial text-[clamp(2.5rem,6vw,4.8rem)] leading-[1.02] tracking-[-.04em] text-[#f7f0e9]">
              It's time for your birthday spotlight...<br />
              <span className="italic text-[#E50914]">are you ready?</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#c7bebc]">
              You've explored the memories and journey of Mr.MD. Now let's celebrate Chapter 27 with cake and wishes!
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                data-testid="button-lets-celebrate"
                onClick={() => {
                  setCelebrationStep('cake');
                  setCandlesLit(true);
                }}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#E50914] via-[#ff2a36] to-[#b8000a] px-8 py-4 sm:px-11 sm:py-5 font-bold text-white text-base sm:text-lg shadow-[0_0_35px_rgba(229,9,20,0.65)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_55px_rgba(229,9,20,0.9)] active:scale-95 cursor-pointer"
              >
                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🎂</span>
                <span className="tracking-wide">Let's celebrate your birthday?</span>
                <span className="text-xl">✨</span>
              </button>
            </div>
          </div>
        )}

        {/* 🎂 STEP 2: CAKE, BALLOONS, CANDLES, 2 FIREWORKS & MAKE A WISH (NO AUTO TIMER) */}
        {celebrationStep === 'cake' && (
          <div className="relative mx-auto max-w-[850px] px-5 py-14 text-center z-10 w-full animate-celebrate-zoom">
            <h2 className="font-editorial text-[clamp(2.3rem,5.5vw,4.2rem)] leading-[1.05] text-[#f7f0e9]">
              Make a wish, Broo! 🌟
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#d8cfd6] max-w-lg mx-auto">
              Take all the time you need to make your heartfelt wish... Think about all your dreams, summits, and peace for Chapter 27! ✨
            </p>

            {/* 3D Birthday Cake with Lit Candles */}
            <div className="my-7">
              <BirthdayCakeWithCandles lit={candlesLit} />
            </div>

            {/* Blow Candles Button */}
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                data-testid="button-blow-candles"
                onClick={handleBlowCandles}
                disabled={!candlesLit}
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#FFB703] via-[#F59E0B] to-[#D97706] px-9 py-4 font-bold text-black text-base shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span className="text-2xl">💨</span>
                <span className="font-semibold tracking-wide">Blow the Candles!</span>
                <span className="text-xl">🕯️</span>
              </button>
            </div>
          </div>
        )}

        {/* 🎆 STEP 3: CANDLES OFF -> BIG HAPPY BIRTHDAY WITH MASSIVE BLAST & FIREWORKS (MANUAL CLICK TO PROCEED) */}
        {celebrationStep === 'happy_birthday' && (
          <div className="relative mx-auto max-w-[950px] px-5 py-20 text-center z-10 w-full animate-celebrate-zoom">
            <h1 className="font-editorial text-[clamp(3rem,8.5vw,7rem)] font-black uppercase leading-[.92] tracking-tight">
              <span className="bg-gradient-to-r from-[#FFE066] via-[#FF3B47] to-[#FFD700] bg-clip-text text-transparent drop-shadow-[0_10px_35px_rgba(229,9,20,0.85)]">
                Happy Birthday<br />Broo!{' '}
              </span>
              <span className="inline-block drop-shadow-md">🎂🥳</span>
            </h1>

            <p className="mt-6 font-editorial text-2xl sm:text-3xl italic text-[#f7ede2] drop-shadow">
              "Here's to peace, joy, mountain peaks, and Chapter 27!" ✨
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                data-testid="button-view-dedication"
                onClick={() => setCelebrationStep('revealed')}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#E50914] px-9 py-4 font-bold text-white text-base shadow-[0_0_40px_rgba(229,9,20,0.8)] transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>A Birthday Message for You</span>
                <span>💌</span>
              </button>
            </div>
          </div>
        )}

        {/* 💌 STEP 4: FULL DEDICATION SECTION REVEALED AS IT IS (NO LOT OF FIREWORKS, SUBTLE ICON TO CELEBRATE AGAIN) */}
        {celebrationStep === 'revealed' && (
          <div className="w-full animate-celebrate-zoom relative">
            {/* ✨ Starfield & Falling Snow / Stardust in the Middle Center Gap */}
            <DedicationStarfield />

            <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-9 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-24 z-10">
              {/* Left Column: Dedication & Positive Birthday Wishes */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  {/* Subtle little cake icon to celebrate again if he wants */}
                  <button
                    type="button"
                    data-testid="button-replay-celebration-icon"
                    onClick={() => {
                      setCelebrationStep('cake');
                      setCandlesLit(true);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-[#E50914]/25 hover:border-[#E50914]/60 text-[#d6ccc5] hover:text-white transition text-xs cursor-pointer shadow-sm active:scale-90"
                    title="Celebrate again 🎂"
                    aria-label="Celebrate again"
                  >
                    🎂
                  </button>
                </div>
                <h2 className="mt-4 font-editorial text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[.98] tracking-[-.04em] text-[#f3eae2]">
                  A little more<br />
                  <span className="italic text-[#E50914]">than a birthday.</span>
                </h2>

                <div className="mt-7 space-y-4">
                  <p className="font-editorial text-[22px] sm:text-[26px] leading-[1.5] text-[#f5eee6] font-medium flex items-center gap-2.5 flex-wrap">
                    <span>Happy Birthday to you, my dear brother!</span>
                    <span className="inline-flex items-center -space-x-2 animate-float-slow select-none align-middle" title="Birthday balloons">
                      <svg width="26" height="34" viewBox="0 0 28 38" fill="none" className="drop-shadow-[0_2px_8px_rgba(229,9,20,0.65)]">
                        <ellipse cx="14" cy="15" rx="11" ry="14" fill="url(#balloonRed)" />
                        <ellipse cx="10" cy="10" rx="3" ry="5" fill="white" fillOpacity="0.55" transform="rotate(-20 10 10)" />
                        <polygon points="12,29 16,29 14,27" fill="#8f060d" />
                        <path d="M 14 29 Q 10 33 13 38" stroke="#ff7b82" strokeWidth="1.2" fill="none" />
                      </svg>
                      <svg width="28" height="36" viewBox="0 0 28 38" fill="none" className="drop-shadow-[0_2px_8px_rgba(255,183,3,0.65)]">
                        <ellipse cx="14" cy="15" rx="11" ry="14" fill="url(#balloonGold)" />
                        <ellipse cx="10" cy="10" rx="3" ry="5" fill="white" fillOpacity="0.6" transform="rotate(-20 10 10)" />
                        <polygon points="12,29 16,29 14,27" fill="#b45309" />
                        <path d="M 14 29 Q 18 33 15 38" stroke="#fcd34d" strokeWidth="1.2" fill="none" />
                      </svg>
                    </span>
                    <span>🎂</span>
                    <span>✨</span>
                  </p>

                  <p className="text-[15px] sm:text-base leading-relaxed text-[#d6ccc5]">
                    May this 27th birthday bring deep peace to your mind, quiet joy to your heart, and boundless strength to your soul. I hope this year opens up paths to every dream destination and breathtaking summit you’ve ever wanted to visit — trekking under wide open skies and exploring the world freely.
                  </p>

                  <p className="text-[15px] sm:text-base leading-relaxed text-[#a89ea5]">
                    Surround yourself with genuine, uplifting friends who make you laugh, value your time, and nurture your mental health. Protect your peace, celebrate your journey, and remember that you deserve every bit of happiness and fulfillment life has to offer.
                  </p>
                </div>

                {/* Sibling Love Dedication */}
                <div className="mt-9 flex flex-wrap items-center gap-4 pt-2">
                  <div className="h-px w-12 bg-gradient-to-r from-[#E50914] to-transparent" />
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-2xl italic text-[#f5eae2] drop-shadow">With all my love, always</span>
                    <span className="text-xl">❤️</span>
                  </div>
                  <span className="rounded-full border border-[#E50914]/40 bg-[#E50914]/10 px-3 py-1 font-mono-label text-[10px] uppercase tracking-wider text-[#E50914]">
                    Chapter 27 ✨
                  </span>
                </div>
              </div>

              {/* Right Column: catman.jpeg Photo Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group w-full max-w-[420px]">
                  {/* Glow backdrop behind photo */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#E50914]/40 via-white/10 to-transparent blur-md opacity-70 group-hover:opacity-100 transition duration-500" />

                  {/* Photo Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#1e1e1e] shadow-2xl">
                    <img
                      src="/imgs/catman.jpeg"
                      alt="Manu with a cat"
                      className="w-full h-auto max-h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Subtle bottom gradient on the photo */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-5">
                      <div>

                        {/* <p className="text-sm font-editorial text-white/95 italic">
                          "Good vibes, warm hearts, and quiet companions." 🐾
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:px-9 sm:text-left lg:px-14">
        <a href="#top" className="font-editorial text-xl tracking-[-.05em] text-[#eee7e0]">Manu<span className="italic text-[#E50914]">flix</span></a>
        <p className="text-[11px] text-[#827984]">Happy Birthday</p>
        <div className="flex items-center gap-5">
          {onLock && (
            <button
              onClick={onLock}
              className="font-mono-label text-[9px] uppercase tracking-[.14em] text-[#696168] transition hover:text-[#E50914]"
              title="Lock and ask for birthday again"
            >
              Reset Birthday Gate
            </button>
          )}
          <a href="#top" className="inline-flex items-center gap-2 font-mono-label text-[9px] uppercase tracking-[.14em] text-[#aaa0a8] transition hover:text-[#E50914]">Back to the beginning <ArrowDown size={12} className="rotate-180" /></a>
        </div>
      </footer>
      <MemoryModal memory={selected} onClose={() => setSelected(null)} />
      {noteOpen && <BirthdayNote onClose={() => setNoteOpen(false)} />}
    </main>
  );
}

function NetflixIntroPlayer({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay with sound prevented, playing muted:', err);
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {
            onFinish();
          });
        });
      }
    }
  }, [onFinish]);

  const toggleMute = () => {
    if (videoRef.current) {
      const next = !videoRef.current.muted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black select-none">
      <video
        ref={videoRef}
        src="/manuflix_intro.mp4"
        playsInline
        autoPlay
        onEnded={onFinish}
        onError={() => {
          console.error('Intro video error, skipping to home');
          onFinish();
        }}
        className="h-full w-full object-contain max-h-[100dvh]"
      />

      {/* Netflix Skip Intro & Sound Controls */}
      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 z-20 flex items-center gap-3">
        {isMuted && (
          <button
            type="button"
            onClick={toggleMute}
            className="flex items-center gap-2 rounded-[4px] border border-white/30 bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/90"
            title="Unmute"
          >
            <VolumeX size={15} /> Unmute
          </button>
        )}
        <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-1.5 rounded-[4px] border border-white/40 bg-black/60 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-white backdrop-blur-md transition hover:border-white hover:bg-black/90 active:scale-95"
        >
          Skip Intro <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem('manuflix_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [showIntro, setShowIntro] = useState(false);

  const handleUnlock = (selectedDate: string) => {
    try {
      localStorage.setItem('manuflix_unlocked', 'true');
      localStorage.setItem('manuflix_birthday', selectedDate);
    } catch (e) {
      console.error(e);
    }
    setUnlocked(true);
    setShowIntro(true);
  };

  const handleLock = () => {
    try {
      localStorage.removeItem('manuflix_unlocked');
      localStorage.removeItem('manuflix_birthday');
    } catch (e) {
      console.error(e);
    }
    setShowIntro(false);
    setUnlocked(false);
    window.location.hash = '';
    history.pushState('', document.title, window.location.pathname);
  };

  if (showIntro) {
    return <NetflixIntroPlayer onFinish={() => setShowIntro(false)} />;
  }

  return unlocked ? <Collection onLock={handleLock} /> : <BirthdayGate onUnlock={handleUnlock} />;
}

export default App;
