
const notes = {
  A3: 220.00,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  Db4: 277.18,
  D4: 293.66,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  Gb4: 369.99,
  G4: 369.99,
  Ab4: 415.3,
  A4: 440,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  Db5: 554.37,
  D5: 587.33,
  Eb5: 622.25,
  E5: 659.25,
  F5: 698.46,
  Gb5: 739.99,
  G5: 783.99,
  Ab5: 830.61,
  A5: 880
}

/**
 * Play a sound with a specified wave form, with a specific duration, 
 * with a specific frequency,
 * with a specific detuning in cents, and then stop.
 * Gain node is currently doing nothing, but ideally
 * I want to use this to gently fade the note
 */
const playNote = function (shape = 'sine', duration = 1000, frequency = 440, detune = 0) {
  // start by creating a new AudioContext
  let audioContext = new AudioContext();
  // create the audio source. In this case it is an oscillator,
  // but it could also be an mp3 or other 
  let oscillator = audioContext.createOscillator();
  oscillator.type = shape;
  oscillator.frequency.value = frequency;
  oscillator.detune.setValueAtTime(detune, audioContext.currentTime);
  // The gain node is a modifier node
  let gainNode = audioContext.createGain();
  // connect the source to the modifier to the destination in a chain
  oscillator.connect(gainNode).connect(audioContext.destination);
  // start the note
  oscillator.start();
  // end the note after the specified time
  setTimeout(() => {
    oscillator.stop();
  }, duration);
}

const playNoteSequence = async function (shape = 'sine', duration = 1000, frequency1 = 440, frequency2 = 659.25, detune = 0, harmonic=true) {
  /**
   * Play two notes in sequence OR simultaneously.
   * detune refers to the detuning of the second note
   * The first note will always be in tune.
   * If harmonic is true, the notes play simultaneously.
   * Otherwise, the notes play in sequence
   */
  playNote(shape, duration, frequency1, 0);
  setTimeout(() => {
    playNote(shape, duration, frequency2, detune);
  }, harmonic ? 0 : duration);
}

const button1 = document.getElementById('button-1');
button1.addEventListener('click', () => {
  playNote('square', 500, 700);
});

const button2 = document.getElementById('button-2');
button2.addEventListener('click', () => {
  playNote('square', 500, 700, -50);
});

const button3 = document.getElementById('button-3');
button3.addEventListener('click', () => {
  playNote('square', 500, 700, 50);
})

const button4 = document.getElementById('button-4');
button4.addEventListener('click', () => {
  playNoteSequence('square', 500, 440, 659.25, 0, true);
})
