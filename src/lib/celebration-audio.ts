// Celebration audio synthesizer: Realistic breath "uffff" blow, firework blast sounds, and Happy Birthday music.

let sharedAudioCtx: AudioContext | null = null;
let currentSongTimeouts: number[] = [];
let fireworkShowInterval: number | null = null;
let fireworkShowTimeouts: number[] = [];

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * 💨 1. Realistic human breath "uffffffff" candle blow sound
 * Synthesizes a real pursed-lip air exhalation whoosh and wick extinguish.
 */
export function playCandleBlowSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.85;

    // Buffer for realistic turbulent air exhalation
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink/Brown noise generator for rich breath wind sound
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      data[i] = (b0 + b1 + b2 + b3) * 0.22;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Resonant bandpass filter modeling mouth/lip shape during "ufff"
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(450, now);
    bandpass.frequency.linearRampToValueAtTime(750, now + 0.25);
    bandpass.frequency.exponentialRampToValueAtTime(320, now + duration);
    bandpass.Q.setValueAtTime(1.8, now);

    // Lowpass filter to keep wind warm and avoid digital harshness
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, now);
    lowpass.frequency.exponentialRampToValueAtTime(250, now + duration);

    // Dynamic breath gain envelope (puff rise -> sustained "ufff" rush -> sudden puff cutoff)
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.18);
    gain.gain.setValueAtTime(0.50, now + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);

    // Subtle wick extinguish sizzle / pop at the end
    const sizzleTime = now + 0.35;
    const sizzleBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.15), ctx.sampleRate);
    const sizzleData = sizzleBuffer.getChannelData(0);
    for (let i = 0; i < sizzleData.length; i++) {
      sizzleData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
    }
    const sizzleSource = ctx.createBufferSource();
    sizzleSource.buffer = sizzleBuffer;
    const sizzleFilter = ctx.createBiquadFilter();
    sizzleFilter.type = 'highpass';
    sizzleFilter.frequency.setValueAtTime(3000, sizzleTime);

    const sizzleGain = ctx.createGain();
    sizzleGain.gain.setValueAtTime(0.12, sizzleTime);
    sizzleGain.gain.exponentialRampToValueAtTime(0.001, sizzleTime + 0.15);

    sizzleSource.connect(sizzleFilter);
    sizzleFilter.connect(sizzleGain);
    sizzleGain.connect(ctx.destination);

    sizzleSource.start(sizzleTime);
    sizzleSource.stop(sizzleTime + 0.15);
  } catch (e) {
    console.error('Candle blow sound error:', e);
  }
}

/**
 * 🚀 Firework ascending rocket whistle / whoosh sound
 */
export function playFireworkRocketWhoosh(volume = 0.35) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.65;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + duration);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {}
}

/**
 * 🎆 2. Deep Firework Explosion, Blast & Crackle Sound
 */
export function playFireworkBlast(volume = 0.6) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Deep Sub-Bass Explosion Thud
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(180, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.55);

    subGain.gain.setValueAtTime(volume * 0.95, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.6);

    // 2. Blast Noise Burst (Boom & Echo)
    const blastLength = Math.floor(ctx.sampleRate * 0.85);
    const blastBuffer = ctx.createBuffer(1, blastLength, ctx.sampleRate);
    const blastData = blastBuffer.getChannelData(0);
    for (let i = 0; i < blastLength; i++) {
      blastData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.22));
    }

    const blastSource = ctx.createBufferSource();
    blastSource.buffer = blastBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.75);

    const blastGain = ctx.createGain();
    blastGain.gain.setValueAtTime(volume * 0.8, now);
    blastGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    blastSource.connect(filter);
    filter.connect(blastGain);
    blastGain.connect(ctx.destination);

    blastSource.start(now);
    blastSource.stop(now + 0.85);

    // 3. Crackling Sparks & Embers (pyrotechnic sizzle pops)
    const crackleCount = 10;
    for (let i = 0; i < crackleCount; i++) {
      const popTime = now + 0.25 + Math.random() * 0.45;
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(800 + Math.random() * 1400, popTime);

      popGain.gain.setValueAtTime(volume * 0.25, popTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.04);

      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(popTime);
      popOsc.stop(popTime + 0.05);
    }
  } catch (e) {
    console.error('Firework blast sound error:', e);
  }
}

/**
 * 🎆 Grand Continuous Celebration Fireworks Show Audio
 * Periodically launches firework rocket whooshes and explosive blasts.
 */
export function startCelebrationFireworksShow() {
  stopCelebrationFireworksShow();

  // Initial immediate blast
  playFireworkBlast(0.65);

  const blastPattern = [
    { delay: 1100, whoosh: true, vol: 0.55 },
    { delay: 2400, whoosh: false, vol: 0.6 },
    { delay: 3600, whoosh: true, vol: 0.7 },
    { delay: 4800, whoosh: false, vol: 0.5 },
    { delay: 6200, whoosh: true, vol: 0.65 },
    { delay: 7800, whoosh: false, vol: 0.75 },
    { delay: 9200, whoosh: true, vol: 0.6 },
    { delay: 10800, whoosh: false, vol: 0.7 },
  ];

  blastPattern.forEach(({ delay, whoosh, vol }) => {
    if (whoosh) {
      const whooshId = window.setTimeout(() => {
        playFireworkRocketWhoosh(0.35);
      }, Math.max(0, delay - 500));
      fireworkShowTimeouts.push(whooshId);
    }

    const blastId = window.setTimeout(() => {
      playFireworkBlast(vol);
    }, delay);
    fireworkShowTimeouts.push(blastId);
  });

  // Recurring blasts every 4 seconds after pattern finishes
  fireworkShowInterval = window.setInterval(() => {
    playFireworkRocketWhoosh(0.3);
    const blastTimer = window.setTimeout(() => {
      playFireworkBlast(0.55 + Math.random() * 0.2);
    }, 450);
    fireworkShowTimeouts.push(blastTimer);
  }, 4200);
}

export function stopCelebrationFireworksShow() {
  if (fireworkShowInterval !== null) {
    clearInterval(fireworkShowInterval);
    fireworkShowInterval = null;
  }
  fireworkShowTimeouts.forEach((id) => clearTimeout(id));
  fireworkShowTimeouts = [];
}

/**
 * 🎶 3. Synthesized Happy Birthday Song Melody (Festive Chimes & Bells)
 */
export function playHappyBirthdaySong(volume = 0.45, onFinish?: () => void) {
  stopCelebrationMelody();
  try {
    const ctx = getAudioContext();

    // Notes: [frequency, duration in seconds]
    // G4=392.00, A4=440.00, B4=493.88, C5=523.25, D5=587.33, E5=659.25, F5=698.46, G5=783.99
    const melody: [number, number][] = [
      // "Happy Birthday to you"
      [392.00, 0.35], [392.00, 0.25], [440.00, 0.55], [392.00, 0.55], [523.25, 0.55], [493.88, 0.95],
      // "Happy Birthday to you"
      [392.00, 0.35], [392.00, 0.25], [440.00, 0.55], [392.00, 0.55], [587.33, 0.55], [523.25, 0.95],
      // "Happy Birthday dear Manu"
      [392.00, 0.35], [392.00, 0.25], [783.99, 0.65], [659.25, 0.55], [523.25, 0.55], [493.88, 0.55], [440.00, 0.95],
      // "Happy Birthday to you"
      [698.46, 0.35], [698.46, 0.25], [659.25, 0.55], [523.25, 0.55], [587.33, 0.65], [523.25, 1.35],
    ];

    let noteDelay = 0.15;

    melody.forEach(([freq, dur]) => {
      const timeoutId = window.setTimeout(() => {
        playBellNote(ctx, freq, dur, volume);
      }, noteDelay * 1000);
      currentSongTimeouts.push(timeoutId);
      noteDelay += dur * 0.92;
    });

    if (onFinish) {
      const finishTimeout = window.setTimeout(onFinish, (noteDelay + 0.6) * 1000);
      currentSongTimeouts.push(finishTimeout);
    }
  } catch (e) {
    console.error('Happy birthday song error:', e);
  }
}

function playBellNote(ctx: AudioContext, frequency: number, duration: number, volume: number) {
  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, now);

    // Subtle rich bell overtone (octave + 5th)
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2.002, now);

    // Warm sub overtone
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 0.5, now);

    const masterGain = volume * 0.38;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(masterGain, now + 0.035);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
  } catch {}
}

export function stopCelebrationMelody() {
  currentSongTimeouts.forEach((id) => clearTimeout(id));
  currentSongTimeouts = [];
}

export function stopCelebrationAudio() {
  stopCelebrationMelody();
  stopCelebrationFireworksShow();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 🎤 4. Real "uffff" Breath Blow Detector with Warmup Calibration & Progress Feedback
 *
 * Prevents premature automatic trigger:
 * - 800ms warmup delay ignores initial microphone hardware startup pop.
 * - Dynamic baseline noise calibration.
 * - Requires strong, sustained low-frequency air turbulence (pursed-lip breath stream).
 * - Requires 9 consecutive frames (~200ms - 250ms) of real blowing.
 * - Reports real-time blow progress (0.0 to 1.0) for visual feedback and flame flicker.
 */
export async function detectMicBlow(
  onBlow: () => void,
  onProgress?: (progress: number) => void
): Promise<(() => void) | null> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const ctx = getAudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.25;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let active = true;
    let consecutiveHits = 0;
    const targetHits = 9; // ~200-250ms of sustained breath stream
    let animId = 0;

    const startTime = Date.now();
    let baselineSum = 0;
    let baselineSamples = 0;
    let calibratedBaseline = 35; // Default safety baseline

    const check = () => {
      if (!active) return;
      analyser.getByteFrequencyData(dataArray);

      // Low frequency air rush bins (bins 1 to 10 correspond to ~40Hz - 220Hz wind turbulence)
      let lowSum = 0;
      const lowBins = Math.min(10, bufferLength);
      for (let i = 1; i < lowBins; i++) {
        lowSum += dataArray[i];
      }
      const avgLow = lowSum / (lowBins - 1);

      // Total energy
      let totalSum = 0;
      for (let i = 0; i < bufferLength; i++) {
        totalSum += dataArray[i];
      }
      const avgTotal = totalSum / bufferLength;

      const elapsed = Date.now() - startTime;

      // 1. Warmup Grace Period: Discard initial 800ms to ignore hardware click/pop
      if (elapsed < 800) {
        onProgress?.(0);
        animId = requestAnimationFrame(check);
        return;
      }

      // 2. Baseline Noise Calibration over the next 600ms
      if (elapsed < 1400) {
        baselineSum += avgLow;
        baselineSamples++;
        calibratedBaseline = Math.max(30, baselineSum / baselineSamples);
        onProgress?.(0);
        animId = requestAnimationFrame(check);
        return;
      }

      // 3. Real Breath "uffff" Detection:
      // Pursed lips blowing directly onto mic causes high aerodynamic low turbulence well above room baseline
      const breathThreshold = Math.max(70, calibratedBaseline + 42);
      const isBreathingWind = avgLow > breathThreshold && avgTotal > 32;

      if (isBreathingWind) {
        consecutiveHits++;
        const progress = Math.min(1, consecutiveHits / targetHits);
        onProgress?.(progress);

        if (consecutiveHits >= targetHits) {
          cleanup();
          onBlow();
          return;
        }
      } else {
        // Smoothly decay hits so breathing breaks don't reset to 0 instantly
        consecutiveHits = Math.max(0, consecutiveHits - 1.5);
        const progress = Math.min(1, consecutiveHits / targetHits);
        onProgress?.(progress);
      }

      animId = requestAnimationFrame(check);
    };

    animId = requestAnimationFrame(check);

    const cleanup = () => {
      active = false;
      cancelAnimationFrame(animId);
      onProgress?.(0);
      stream.getTracks().forEach((track) => track.stop());
      try {
        source.disconnect();
      } catch {}
    };

    return cleanup;
  } catch (err) {
    console.log('Microphone access unavailable or denied:', err);
    return null;
  }
}
