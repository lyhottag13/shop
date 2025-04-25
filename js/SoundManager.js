export class SoundManager {
    constructor() {
        this.audioContext = null;
        this.buffers = {};
        this.source = null;
        this.backgroundSource = null;
        this.gain = null;
    }
    construct() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {};
        this.source = null;
        this.backgroundSource = null;
        this.gain = this.audioContext.createGain();
    }
    async load(name) {
        const response = await fetch(`resources/audio/${name}.mp3`);
        const array = await response.arrayBuffer();
        const buffer = await this.audioContext.decodeAudioData(array);
        this.buffers[name] = buffer;
    }
    play(name) {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffers[name];
        this.source.connect(this.audioContext.destination);
        this.source.start(0);
    }
    /**
     * This method will begin playing the background music. It connects a gain to the background music
     * so that the stopBackgroundMusic method will be able to gradually stop the music or 
     * setBackgroundVolume can gradually volumize the music.
     * 
     * @param {string} name -  The file name of the background music to be played.
     */
    playBackgroundMusic(name) {
        this.backgroundSource = this.audioContext.createBufferSource();
        this.backgroundSource.buffer = this.buffers[name];
        this.backgroundSource.connect(this.gain).connect(this.audioContext.destination);
        this.backgroundSource.start(0);
        this.gain.gain.value = 1;
        this.backgroundSource.loop = true;
    }
    stopBackgroundMusic(delay) {
        if (this.backgroundSource === null) {
            return;
        }
        const now = this.audioContext.currentTime;
        this.gain.gain.setValueAtTime(this.gain.gain.value, now);
        this.gain.gain.linearRampToValueAtTime(0, now + delay);
        this.backgroundSource.stop(now + delay);
    }
    setBackgroundVolume(initialVolume, endVolume, delay) {
        if (this.backgroundSource === null) {
            return;
        }
        if (initialVolume < 0) {
            initialVolume = this.gain.gain.value;
        }
        this.gain.gain.setValueAtTime(initialVolume, this.audioContext.currentTime);
        this.gain.gain.linearRampToValueAtTime(endVolume, this.audioContext.currentTime + delay);
    }
}