// services/audioService.ts

let audioContext: AudioContext | null = null;

const initializeAudio = () => {
  // Create AudioContext after a user gesture (e.g., a click)
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
    }
  }
};

const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.5
) => {
  if (!audioContext) return;
  
  // Resume context if it's suspended (e.g., after page load)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playNoteSequence = (notes: { freq: number, duration: number, delay: number, type?: OscillatorType }[]) => {
  if (!audioContext) return;

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const startTime = audioContext.currentTime;
  notes.forEach(note => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = note.type || 'sine';
    oscillator.frequency.setValueAtTime(note.freq, startTime + note.delay);
    gainNode.gain.setValueAtTime(0.4, startTime + note.delay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + note.delay + note.duration);

    oscillator.start(startTime + note.delay);
    oscillator.stop(startTime + note.delay + note.duration);
  });
};

export const playMoveSound = () => {
  initializeAudio();
  playTone(600, 0.1, 'triangle', 0.4);
};

export const playWinSound = () => {
  initializeAudio();
  const notes = [
    { freq: 523.25, duration: 0.15, delay: 0 }, // C5
    { freq: 659.25, duration: 0.15, delay: 0.15 }, // E5
    { freq: 783.99, duration: 0.15, delay: 0.3 }, // G5
    { freq: 1046.50, duration: 0.2, delay: 0.45 }, // C6
  ];
  playNoteSequence(notes);
};

export const playDrawSound = () => {
  initializeAudio();
  const notes = [
    // FIX: Use 'as const' to infer the literal type 'square' which is assignable to OscillatorType.
    { freq: 440, duration: 0.2, delay: 0, type: 'square' as const }, // A4
    { freq: 349.23, duration: 0.3, delay: 0.2, type: 'square' as const }, // F4
  ];
  playNoteSequence(notes);
};

export const playClickSound = () => {
  initializeAudio();
  playTone(800, 0.05, 'square', 0.3);
};