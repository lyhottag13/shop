export class Animator {
    constructor(width, source) {
        this.animation = document.getElementById(source);
        this.FRAME_WIDTH = width;
        this.isMobile = window.innerWidth < 600 ? true : false;
    }
    async setAnimation(imageSource, frames, framerate, end, backgroundSize = `auto ${this.isMobile ? "3" : "5"}00px`) {
        this.animation.style.setProperty("--animation-image", `url(${imageSource.src})`);
        this.animation.style.setProperty("--background-width", this.FRAME_WIDTH * frames);
        this.animation.style.setProperty("--background-size", backgroundSize);
        this.animation.style.setProperty("--frames", (frames - 1));
        this.animation.style.setProperty("--animation-length", `${frames / framerate}s`);
        this.animation.style.animation = `none`;
        this.animation.offsetHeight;
        this.animation.style.animation = `anim var(--animation-length) steps(var(--frames)) ${end}`;
        await new Promise(resolve => {
            this.animation.addEventListener("animationend", resolve, { once: true });
        });
    }
    setWidth(width) {
        this.FRAME_WIDTH = width;
    }
}