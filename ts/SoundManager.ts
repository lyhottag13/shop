export class SoundManager {
    private source!: AudioBufferSourceNode;
    private backgroundSource!: AudioBufferSourceNode;
    private audioContext: AudioContext;
    private buffers: Record<string, AudioBuffer>;
    private isSpamming: boolean;
    private gain: GainNode;
    constructor(
        buffers: Record<string, AudioBuffer> = {},
        isSpamming: boolean = false
    ) {
        this.isSpamming = isSpamming;
        this.buffers = buffers;
        this.audioContext =  new (window.AudioContext || (window as any).webkitAudioContext)();
        this.gain = this.audioContext.createGain();
    }
    async load(fileName: string) {
        const response = await fetch(`resources/audio/${fileName}.mp3`);
        const array = await response.arrayBuffer();
        const buffer = await this.audioContext.decodeAudioData(array);
        this.buffers[fileName] = buffer;
    }
    play(fileName: string) {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffers[fileName];
        this.source.connect(this.audioContext.destination);
        this.source.start(0);
    }
    playSpammableSFX(fileName: string) {
        if (!this.isSpamming) {
            this.isSpamming = true;
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffers[fileName];
            this.source.connect(this.audioContext.destination);
            this.source.start(0);
            this.source.onended = () => {
                this.isSpamming = false;
            }
        }
    }
    /**
     * This method will begin playing the background music. It connects a gain to the background music
     * so that the stopBackgroundMusic method will be able to gradually stop the music or 
     * setBackgroundVolume can gradually volumize the music.
     * 
     * @param fileName -  The file name of the background music to be played.
     */
    playBackgroundMusic(fileName: string) {
        this.backgroundSource = this.audioContext.createBufferSource();
        this.backgroundSource.buffer = this.buffers[fileName];
        this.backgroundSource.connect(this.gain).connect(this.audioContext.destination);
        this.backgroundSource.start(0);
        this.gain.gain.value = 1;
        this.backgroundSource.loop = true;
    }
    /**
     * This stops the current background music if there is any.
     * @param delay - The time in seconds to delay before the audio is completely gone.
     */
    stopBackgroundMusic(delay = 0) {
        const now = this.audioContext.currentTime;
        this.gain.gain.setValueAtTime(this.gain.gain.value, now);
        this.gain.gain.linearRampToValueAtTime(0, now + delay);
        this.backgroundSource.stop(now + delay);
    }
    setBackgroundVolume({
        initialVolume = this.gain.gain.value, 
        endVolume, 
        delay
    }: {
        initialVolume?: number, 
        endVolume: number, 
        delay: number
    }) {
        if (!this.backgroundSource) {
            return;
        }
        this.gain.gain.setValueAtTime(initialVolume, this.audioContext.currentTime);
        this.gain.gain.linearRampToValueAtTime(endVolume, this.audioContext.currentTime + delay);
    }
}