export const notes = {
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
};

export const intervals = {
  'UNISON': 0,
  'MINOR-2ND': 1,
  'MAJOR-2ND': 2,
  'MINOR-3RD': 3,
  'MAJOR-3RD': 4,
  'PERFECT-4TH': 5,
  'TRITONE': 6,
  'PERFECT-5TH': 7,
  'MINOR-6TH': 8,
  'MAJOR-6TH': 9,
  'MINOR-7TH': 10,
  'MAJOR-7TH': 11,
  'OCTAVE': 12,
};

export const playNote = function (audioContext, shape = 'sine', duration = 1000, frequency = 440, detune = 0) {
  /**
 * Play a sound with a specified wave form, with a specific duration, 
 * with a specific frequency,
 * with a specific detuning in cents, and then stop.
 * Gain node is currently doing nothing, but ideally
 * I want to use this to gently fade the note
 */
  // create the audio source. In this case it is an oscillator,
  // but it could also be an mp3 or other 
  let oscillator = audioContext.createOscillator();
  oscillator.type = shape;
  oscillator.frequency.value = frequency;
  oscillator.detune.setValueAtTime(detune, audioContext.currentTime);
  // The gain node is a modifier node
  let gainNode = audioContext.createGain();
  gainNode.gain.value = .4;
  // connect the source to the modifier to the destination in a chain
  oscillator.connect(gainNode).connect(audioContext.destination);
  // start the note
  oscillator.start();
  // end the note after the specified time
  setTimeout(() => {
    oscillator.stop();
  }, duration);
}

export const playNoteSequence = async function (audioContext, shape = 'sine', duration = 1000, frequency1 = 440, interval = 7, detune = 0, harmonic = true) {
  /**
   * Play two notes in sequence OR simultaneously.
   * Interval is the number of semitones
   * detune refers to the detuning of the second note
   * The first note will always be in tune.
   * If harmonic is true, the notes play simultaneously.
   * Otherwise, the notes play in sequence
   */
  playNote(audioContext, shape, duration, frequency1, 0);
  setTimeout(() => {
    playNote(audioContext, shape, duration, frequency1, interval*100 + detune);
  }, harmonic ? 0 : duration);
}

export class IntervalGroup {
  constructor(numIntervals = 20, shape = 'sine', duration = 1000, baseFrequency = 400, detune = 50) {
    this.numIntervals = numIntervals,
    this.shape = shape;
    this.duration = duration;
    this.baseFrequency = baseFrequency;
    this.detune = detune;

    // Initialize the intervals list
    // This is populated by the generateIntervals method
    this.intervals = [];

    // Initialize the submitted answers list
    this.submittedAnswers = []

  }

  generateIntervals() {
    // Create a specified number of intervals
    for (let i=0; i<this.numIntervals; i++) {
      // Randomly determine if the interval will be flat, perfect, or sharp
      // This corresponds to -1, 0, 1
      // Then add this to the intervals array
      let tuning = 1 - Math.floor(Math.random()*3);
      this.intervals.push(tuning);
    }
  }

  submitAnswer(answer) {
    /**
     * Adds an answer to the submittedAnswers array.
     * Answer is expected to be an integer of value -1, 0, or 1.
     * The user is forced to handle intervals in sequence, 
     * so when I push an answer to the array,
     * it automatically corresoponds to the appropriate interval
     */
    this.submittedAnswers.push(answer);
  }

  isCorrectAnswer(intervalIndex) {
    /**
     * Checks the correct answer against the submitted answer for an interval.
     * Returns true if correct, false if incorrect
     */
    return this.intervals[intervalIndex] === this.submittedAnswers[intervalIndex] ?
      true : false;
  }

  grade() {
    /**
     * counts the number of correct answers submitted
     * and divides by the number of intervals
     * returns grade as a decimal value between 0 and 1
     */
    let correctArray = this.intervals.map((interval, index) => {
      return interval === this.submittedAnswers[index] ? 1 : 0;
    });
    let total = correctArray.reduce((x, y) => { return x + y});
    let grade = total / this.numIntervals;
    return grade;
  }
}