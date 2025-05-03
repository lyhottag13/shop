var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SoundManager {
    constructor() {
        this.audioContext = null;
        this.buffers = {};
        this.source = null;
        this.backgroundSource = null;
        this.gain = null;
        this.isSpamming = false;
    }
    construct() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {};
        this.source = null;
        this.backgroundSource = null;
        this.gain = this.audioContext.createGain();
    }
    load(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`resources/audio/${fileName}.mp3`);
            const array = yield response.arrayBuffer();
            const buffer = yield this.audioContext.decodeAudioData(array);
            this.buffers[fileName] = buffer;
        });
    }
    play(fileName) {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffers[fileName];
        this.source.connect(this.audioContext.destination);
        this.source.start(0);
    }
    playSpammableSFX(fileName) {
        if (!this.isSpamming) {
            this.isSpamming = true;
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffers[fileName];
            this.source.connect(this.audioContext.destination);
            this.source.start(0);
            this.source.onended = () => {
                this.isSpamming = false;
            };
        }
    }
    /**
     * This method will begin playing the background music. It connects a gain to the background music
     * so that the stopBackgroundMusic method will be able to gradually stop the music or
     * setBackgroundVolume can gradually volumize the music.
     *
     * @param {string} fileName -  The file name of the background music to be played.
     */
    playBackgroundMusic(fileName) {
        this.backgroundSource = this.audioContext.createBufferSource();
        this.backgroundSource.buffer = this.buffers[fileName];
        this.backgroundSource.connect(this.gain).connect(this.audioContext.destination);
        this.backgroundSource.start(0);
        this.gain.gain.value = 1;
        this.backgroundSource.loop = true;
    }
    stopBackgroundMusic(delay = 0) {
        if (this.backgroundSource === null) {
            return;
        }
        const now = this.audioContext.currentTime;
        this.gain.gain.setValueAtTime(this.gain.gain.value, now);
        this.gain.gain.linearRampToValueAtTime(0, now + delay);
        this.backgroundSource.stop(now + delay);
    }
    setBackgroundVolume({ initialVolume = this.gain.gain.value, endVolume, delay }) {
        if (this.backgroundSource === null) {
            return;
        }
        this.gain.gain.setValueAtTime(initialVolume, this.audioContext.currentTime);
        this.gain.gain.linearRampToValueAtTime(endVolume, this.audioContext.currentTime + delay);
    }
}
