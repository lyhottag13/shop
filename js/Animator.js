export class Animator {
    constructor(width) {
        this.framerate = 20;
        this.frames = 17;
        this.FRAME_WIDTH = width;
        this.ROW_LENGTH = this.frames * this.FRAME_WIDTH;
        this.animation = document.getElementById("animation");
    }
    setAnimation(imageSource, frames, framerate, end) {
        document.documentElement.style.setProperty("--animation-image", `url(${imageSource.src})`);
        document.documentElement.style.setProperty("--background-width", imageSource.naturalWidth);
        document.documentElement.style.setProperty("--frames", frames);
        document.documentElement.style.setProperty("--animation-length", `${frames / framerate}s`);
        this.animation.style.animation = `anim var(--animation-length) steps(var(--frames)) ${end}`;
    }
}