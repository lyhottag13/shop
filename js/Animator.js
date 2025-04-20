export class Animator {
    constructor(width, source) {
        this.framerate = 20;
        this.frames = 17;
        this.FRAME_WIDTH = width;
        this.ROW_LENGTH = this.frames * this.FRAME_WIDTH;
        this.animation = document.getElementById(source);
    }
    setAnimation(imageSource, frames, framerate, end) {
        this.animation.style.setProperty("--animation-image", `url(${imageSource.src})`);
        this.animation.style.setProperty("--background-width", this.FRAME_WIDTH * frames);
        this.animation.style.setProperty("--background-size", `${this.FRAME_WIDTH * frames}px, ${this.FRAME_WIDTH}px`);
        this.animation.style.setProperty("--frames", (frames - 1));
        this.animation.style.setProperty("--animation-length", `${frames / framerate}s`);
        this.animation.style.animation = `anim var(--animation-length) steps(var(--frames)) ${end}`;
    }
}