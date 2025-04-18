export class Animator {
    constructor() {
        this.FRAMERATE = 12;
        this.FRAMES_PER_ROW = 1;
        this.FRAME_WIDTH = 500;
        this.ROW_LENGTH = this.FRAMES_PER_ROW * this.FRAME_WIDTH;
        this.viewX = 0
        this.x = 0;
        this.animation = document.getElementById("animation");
    }
    animate() {
        setInterval(() => {
            this.animation.style.backgroundPosition = `-${this.viewX}px 0`;
            this.x += this.FRAME_WIDTH;
            this.viewX = this.x % this.ROW_LENGTH;
        }, 1000 / this.FRAMERATE);
    }
    setFrames(frames) {
        this.FRAMES_PER_ROW = frames;
        this.ROW_LENGTH = this.FRAMES_PER_ROW * this.FRAME_WIDTH;
    }
}