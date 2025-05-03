export class Animator {
    animation: HTMLElement;
    isMobile: boolean;
    frameWidth: number;
    constructor(width: number, source: string) {
        this.animation = document.getElementById(source)!;
        this.frameWidth = width;
        this.isMobile = window.innerWidth < 600 ? true : false;
    }
    async setAnimation(imageSource: HTMLImageElement, frames: number, framerate: number, end: string, backgroundSize = `auto ${this.isMobile ? "3" : "5"}00px`): Promise<void> {
        this.animation.style.setProperty("--animation-image", `url(${imageSource.src})`);
        this.animation.style.setProperty("--background-width", `${this.frameWidth * frames}`);
        this.animation.style.setProperty("--background-size", backgroundSize);
        this.animation.style.setProperty("--frames", `${frames - 1}`);
        this.animation.style.setProperty("--animation-length", `${frames / framerate}s`);
        this.animation.style.animation = `none`;
        this.animation.offsetHeight;
        this.animation.style.animation = `anim var(--animation-length) steps(var(--frames)) ${end}`;
        await new Promise(resolve => {
            this.animation.addEventListener("animationend", resolve, { once: true });
        });
    }
}