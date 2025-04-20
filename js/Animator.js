export class Animator {
    constructor(width, source) {
        this.framerate = 20;
        this.frames = 17;
        this.FRAME_WIDTH = width;
        this.ROW_LENGTH = this.frames * this.FRAME_WIDTH;
        this.animation = document.getElementById(source);
    }
    setAnimation(imageSource, frames, framerate, end) {
        document.documentElement.style.setProperty("--animation-image", `url(${imageSource.src})`);
        document.documentElement.style.setProperty("--background-width", this.FRAME_WIDTH * frames);
        document.documentElement.style.setProperty("--background-size", `${this.FRAME_WIDTH * frames}px, ${this.FRAME_WIDTH}px`);
        document.documentElement.style.setProperty("--frames", (frames - 1));
        document.documentElement.style.setProperty("--animation-length", `${frames / framerate}s`);
        this.animation.style.animation = `anim var(--animation-length) steps(var(--frames)) ${end}`;
        console.log()
    }
}