export class SoundManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {};
        this.source = null;
        this.backgroundSource = null;
    }
    async load(name) {
        const response = await fetch("resources/audio/" + name + ".mp3");
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
    playBackgroundMusic(name) {
        this.backgroundSource = this.audioContext.createBufferSource();
        this.backgroundSource.buffer = this.buffers[name];
        this.backgroundSource.connect(this.audioContext.destination);
        this.backgroundSource.start(0);
    }
    stop() {
        this.backgroundSource.stop();
    }
}