import { SoundTouch } from 'soundtouch-ts';

const BUFFER_SIZE = 4096;

/**
 * Check if the browser natively supports preservesPitch on HTMLAudioElement.
 * Returns true if native pitch preservation is available.
 */
export function supportsPreservesPitch(): boolean {
  if (typeof window === 'undefined') return true; // SSR fallback
  const audio = document.createElement('audio');
  return 'preservesPitch' in audio || 'webkitPreservesPitch' in audio;
}

/**
 * SoundTouchProcessor handles pitch-preserving time-stretching for browsers
 * that don't support the native preservesPitch property.
 */
export class SoundTouchProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  private soundTouch: SoundTouch | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private tempo: number = 1.0;
  private isConnected: boolean = false;
  private leftChannel: Float32Array;
  private rightChannel: Float32Array;
  private interleavedBuffer: Float32Array;
  private outputBuffer: Float32Array;

  constructor() {
    this.leftChannel = new Float32Array(BUFFER_SIZE);
    this.rightChannel = new Float32Array(BUFFER_SIZE);
    this.interleavedBuffer = new Float32Array(BUFFER_SIZE * 2);
    this.outputBuffer = new Float32Array(BUFFER_SIZE * 2);
  }

  /**
   * Connect the processor to an audio element.
   */
  connect(audioElement: HTMLAudioElement): void {
    if (this.isConnected) {
      this.disconnect();
    }

    this.audioElement = audioElement;

    // Create AudioContext
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Create SoundTouch instance
    this.soundTouch = new SoundTouch(this.audioContext.sampleRate);
    this.soundTouch.tempo = this.tempo;
    this.soundTouch.pitch = 1.0; // Keep pitch constant

    // Create source node from audio element
    this.sourceNode = this.audioContext.createMediaElementSource(audioElement);

    // Create script processor for real-time processing
    this.scriptNode = this.audioContext.createScriptProcessor(BUFFER_SIZE, 2, 2);
    this.scriptNode.onaudioprocess = this.processAudio.bind(this);

    // Connect: source -> scriptProcessor -> destination
    this.sourceNode.connect(this.scriptNode);
    this.scriptNode.connect(this.audioContext.destination);

    this.isConnected = true;
  }

  /**
   * Process audio through SoundTouch
   */
  private processAudio(event: AudioProcessingEvent): void {
    if (!this.soundTouch) return;

    const inputL = event.inputBuffer.getChannelData(0);
    const inputR = event.inputBuffer.getChannelData(1);
    const outputL = event.outputBuffer.getChannelData(0);
    const outputR = event.outputBuffer.getChannelData(1);

    // Interleave input samples for SoundTouch (L, R, L, R, ...)
    for (let i = 0; i < BUFFER_SIZE; i++) {
      this.interleavedBuffer[i * 2] = inputL[i];
      this.interleavedBuffer[i * 2 + 1] = inputR[i];
    }

    // Feed samples to SoundTouch
    this.soundTouch.inputBuffer.putSamples(this.interleavedBuffer, 0, BUFFER_SIZE);

    // Process
    this.soundTouch.process();

    // Get processed samples
    const framesAvailable = this.soundTouch.outputBuffer.frameCount;
    const framesToRead = Math.min(framesAvailable, BUFFER_SIZE);

    if (framesToRead > 0) {
      this.soundTouch.outputBuffer.receiveSamples(this.outputBuffer, framesToRead);

      // De-interleave output samples
      for (let i = 0; i < framesToRead; i++) {
        outputL[i] = this.outputBuffer[i * 2];
        outputR[i] = this.outputBuffer[i * 2 + 1];
      }

      // Fill remaining with zeros if needed
      for (let i = framesToRead; i < BUFFER_SIZE; i++) {
        outputL[i] = 0;
        outputR[i] = 0;
      }
    } else {
      // No output available yet, fill with silence
      for (let i = 0; i < BUFFER_SIZE; i++) {
        outputL[i] = 0;
        outputR[i] = 0;
      }
    }
  }

  /**
   * Set the playback tempo (speed) while preserving pitch.
   * @param tempo - Playback speed (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
   */
  setTempo(tempo: number): void {
    this.tempo = tempo;
    if (this.soundTouch) {
      this.soundTouch.tempo = tempo;
    }
  }

  /**
   * Disconnect and clean up all resources.
   */
  disconnect(): void {
    if (this.scriptNode) {
      this.scriptNode.disconnect();
      this.scriptNode.onaudioprocess = null;
      this.scriptNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }

    if (this.soundTouch) {
      this.soundTouch.clear();
      this.soundTouch = null;
    }

    this.audioElement = null;
    this.isConnected = false;
  }

  /**
   * Resume the AudioContext if it was suspended (e.g., due to autoplay policy).
   */
  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Check if the processor is currently connected.
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }
}
