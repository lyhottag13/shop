export class SoundManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {};
    }
    async load(name) {
        const response = await fetch("resources/audio/" + name + ".mp3");
        const array = await response.arrayBuffer();
        const buffer = await this.audioContext.decodeAudioData(array);
        this.buffers[name] = buffer;
    }
    play(name) {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.buffers[name];
        source.connect(this.audioContext.destination);
        source.start(0);
    }
}