/**
 * Procedural Lullaby Audio Synthesizer (WAV)
 * Generates an 80-second calming, royalty-free pentatonic music-box / celeste melody.
 * Uses gentle sine waves with soft harmonics, exponential decay envelopes, and subtle reverb.
 */
import fs from 'node:fs';

const SAMPLE_RATE = 44100;
const DURATION_SEC = 80;
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION_SEC;

// Pentatonic lullaby scale (C Major Pentatonic: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5, C6)
const FREQS = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.00,
  A4: 440.00,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.00,
  C6: 1046.50,
  E6: 1318.51
};

// Gentle 4-bar lullaby melody repeated with gentle variations
const MELODY = [
  // Phrase 1 (0-10s)
  { note: 'C5', time: 0.5, dur: 2.0 },
  { note: 'E5', time: 2.0, dur: 2.0 },
  { note: 'G5', time: 3.5, dur: 2.5 },
  { note: 'C6', time: 5.5, dur: 3.0 },
  { note: 'G5', time: 8.0, dur: 2.5 },

  // Phrase 2 (10-20s)
  { note: 'E5', time: 10.5, dur: 2.0 },
  { note: 'D5', time: 12.0, dur: 2.0 },
  { note: 'C5', time: 13.5, dur: 2.5 },
  { note: 'A4', time: 15.5, dur: 2.0 },
  { note: 'G4', time: 17.0, dur: 3.5 },

  // Phrase 3 (20-30s)
  { note: 'C5', time: 20.5, dur: 2.0 },
  { note: 'D5', time: 22.0, dur: 2.0 },
  { note: 'E5', time: 23.5, dur: 2.5 },
  { note: 'G5', time: 25.5, dur: 2.0 },
  { note: 'A5', time: 27.0, dur: 3.5 },

  // Phrase 4 (30-40s)
  { note: 'G5', time: 30.5, dur: 2.0 },
  { note: 'E5', time: 32.0, dur: 2.0 },
  { note: 'D5', time: 33.5, dur: 2.5 },
  { note: 'C5', time: 35.5, dur: 3.5 },
  { note: 'G4', time: 38.0, dur: 2.5 },

  // Phrase 5 (40-50s)
  { note: 'E5', time: 40.5, dur: 2.0 },
  { note: 'G5', time: 42.0, dur: 2.0 },
  { note: 'C6', time: 43.5, dur: 3.0 },
  { note: 'E6', time: 46.0, dur: 3.0 },
  { note: 'D6', time: 48.5, dur: 2.5 },

  // Phrase 6 (50-60s)
  { note: 'C6', time: 51.0, dur: 2.5 },
  { note: 'A5', time: 53.0, dur: 2.0 },
  { note: 'G5', time: 54.5, dur: 3.0 },
  { note: 'E5', time: 57.0, dur: 2.5 },
  { note: 'D5', time: 59.0, dur: 2.0 },

  // Phrase 7 (60-70s)
  { note: 'C5', time: 61.0, dur: 2.5 },
  { note: 'E5', time: 63.0, dur: 2.0 },
  { note: 'G5', time: 64.5, dur: 3.0 },
  { note: 'C6', time: 67.0, dur: 4.0 },

  // Phrase 8 / Outro (70-78s)
  { note: 'G5', time: 71.0, dur: 3.0 },
  { note: 'E5', time: 73.5, dur: 3.0 },
  { note: 'C5', time: 75.5, dur: 4.5 }
];

// Add soft arpeggiated bass harmony notes
const BASS = [
  { note: 'C4', time: 0.0, dur: 4.5 },
  { note: 'G4', time: 5.0, dur: 4.5 },
  { note: 'A4', time: 10.0, dur: 4.5 },
  { note: 'E4', time: 15.0, dur: 4.5 },
  { note: 'F4', time: 20.0, dur: 4.5 },
  { note: 'C4', time: 25.0, dur: 4.5 },
  { note: 'G4', time: 30.0, dur: 4.5 },
  { note: 'C4', time: 35.0, dur: 5.0 },
  { note: 'C4', time: 40.0, dur: 5.0 },
  { note: 'G4', time: 45.0, dur: 5.0 },
  { note: 'A4', time: 50.0, dur: 5.0 },
  { note: 'F4', time: 55.0, dur: 5.0 },
  { note: 'C4', time: 60.0, dur: 5.0 },
  { note: 'G4', time: 65.0, dur: 5.0 },
  { note: 'C4', time: 70.0, dur: 8.0 }
];

const buffer = new Float32Array(TOTAL_SAMPLES);

function renderNote(freq, startTime, duration, amplitude) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const noteSamples = Math.floor(duration * SAMPLE_RATE);

  for (let i = 0; i < noteSamples; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;

    const t = i / SAMPLE_RATE;
    // Exponential bell envelope (fast attack 15ms, smooth decay)
    const attack = Math.min(1.0, t / 0.015);
    const decay = Math.exp(-t * (2.8 / duration));
    const env = attack * decay * amplitude;

    // Music box sound: Sine fundamental + warm 2nd & 3rd harmonic
    const wave =
      Math.sin(2 * Math.PI * freq * t) * 0.75 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.20 +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.05;

    buffer[idx] += wave * env;
  }
}

// Render Melody
for (const n of MELODY) {
  const f = FREQS[n.note] || 440;
  renderNote(f, n.time, n.dur, 0.45);
}

// Render Bass
for (const b of BASS) {
  const f = FREQS[b.note] || (FREQS.C4 * 0.75);
  renderNote(f, b.time, b.dur, 0.22);
}

// Apply soft reverb / delay (delays at 320ms and 640ms)
const delay1 = Math.floor(0.32 * SAMPLE_RATE);
const delay2 = Math.floor(0.64 * SAMPLE_RATE);
const reverbBuffer = new Float32Array(TOTAL_SAMPLES);

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  let val = buffer[i];
  if (i >= delay1) val += buffer[i - delay1] * 0.22;
  if (i >= delay2) val += buffer[i - delay2] * 0.12;
  reverbBuffer[i] = val;
}

// Master normalization and soft limiter
let maxAmp = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const abs = Math.abs(reverbBuffer[i]);
  if (abs > maxAmp) maxAmp = abs;
}

const gain = maxAmp > 0 ? 0.70 / maxAmp : 1;

// Create 16-bit PCM WAV File
const wavBytes = 44 + TOTAL_SAMPLES * 2;
const wavBuffer = Buffer.alloc(wavBytes);

// Write WAV Header
wavBuffer.write('RIFF', 0);
wavBuffer.writeUInt32LE(wavBytes - 8, 4);
wavBuffer.write('WAVE', 8);
wavBuffer.write('fmt ', 12);
wavBuffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
wavBuffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
wavBuffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
wavBuffer.writeUInt32LE(SAMPLE_RATE, 24); // SampleRate
wavBuffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
wavBuffer.writeUInt16LE(2, 32);  // BlockAlign (NumChannels * BitsPerSample/8)
wavBuffer.writeUInt16LE(16, 34); // BitsPerSample
wavBuffer.write('data', 36);
wavBuffer.writeUInt32LE(TOTAL_SAMPLES * 2, 40);

// Write 16-bit PCM Samples
let offset = 44;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  // Fade out smoothly in the last 3 seconds
  let fade = 1.0;
  const remainingSec = (TOTAL_SAMPLES - i) / SAMPLE_RATE;
  if (remainingSec < 3.0) {
    fade = remainingSec / 3.0;
  }

  const sample = Math.max(-1.0, Math.min(1.0, reverbBuffer[i] * gain * fade));
  const intSample = Math.round(sample * 32767);
  wavBuffer.writeInt16LE(intSample, offset);
  offset += 2;
}

fs.mkdirSync('demo', { recursive: true });
fs.writeFileSync('demo/lullaby.wav', wavBuffer);
console.log(`✅ Synthesized 80s procedural lullaby: demo/lullaby.wav (${(wavBytes / 1024 / 1024).toFixed(2)} MB)`);
