// Celebration audio synthesizer: fireworks blast, Happy Birthday song, speech, and mic blow detection.

let sharedAudioCtx: AudioContext | null = null;
let currentSongTimeouts: number[] = [];

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

// 💨 1. Candle blow / breath sound
export function playCandleBlowSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered pink-like noise for breath puff
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.25;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.error('Candle blow sound error:', e);
  }
}

// 🎆 2. Deep Firework Explosion & Blast Sound
export function playFireworkBlast(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sub-bass thud (sine wave dropping fast)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

    oscGain.gain.setValueAtTime(volume * 0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // Explosion noise burst
    const noiseLength = ctx.sampleRate * 0.7;
    const noiseBuffer = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseLength; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.18));
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.7);
  } catch (e) {
    console.error('Firework blast sound error:', e);
  }
}

// 🎶 3. Synthesized Happy Birthday Song Melody (Chime & Bell Carillon)
export function playHappyBirthdaySong(volume = 0.4, onFinish?: () => void) {
  stopCelebrationAudio();
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
      [698.46, 0.35], [698.46, 0.25], [659.25, 0.55], [523.25, 0.55], [587.33, 0.65], [523.25, 1.25],
    ];

    let noteDelay = 0.1;

    melody.forEach(([freq, dur]) => {
      const timeoutId = window.setTimeout(() => {
        playBellNote(ctx, freq, dur, volume);
      }, noteDelay * 1000);
      currentSongTimeouts.push(timeoutId);
      noteDelay += dur * 0.92;
    });

    if (onFinish) {
      const finishTimeout = window.setTimeout(onFinish, (noteDelay + 0.5) * 1000);
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
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, now);

    // Subtle bell overtone (octave + 5th)
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2.01, now);

    const masterGain = volume * 0.35;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(masterGain, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch {}
}

export function stopCelebrationAudio() {
  currentSongTimeouts.forEach((id) => clearTimeout(id));
  currentSongTimeouts = [];
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// 🗣️ 4. Voice "Happy Birthday Broo!"
export function speakHappyBirthday(name = 'Manu') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const text = `Happy Birthday ${name}! Have an incredible year and enjoy Chapter 27!`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.08;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech synthesis error:', e);
  }
}

// 🎤 5. Microphone "ufff" Breath Blow Detector
export async function detectMicBlow(onBlow: () => void): Promise<(() => void) | null> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const ctx = getAudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.2;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let active = true;
    let consecutiveHits = 0;
    let animId = 0;

    const check = () => {
      if (!active) return;
      analyser.getByteFrequencyData(dataArray);

      // Low frequency turbulence bins (bins 1 to 12 correspond to low frequency air rushes)
      let lowSum = 0;
      const lowBins = Math.min(12, bufferLength);
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

      // An "ufff" puff produces high low-frequency energy (> 55) and overall volume (> 28)
      if (avgLow > 55 && avgTotal > 28) {
        consecutiveHits++;
        if (consecutiveHits >= 2) {
          cleanup();
          onBlow();
          return;
        }
      } else {
        consecutiveHits = Math.max(0, consecutiveHits - 1);
      }

      animId = requestAnimationFrame(check);
    };

    animId = requestAnimationFrame(check);

    const cleanup = () => {
      active = false;
      cancelAnimationFrame(animId);
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
