export class Animator {
    animation: HTMLElement;
    isMobile: boolean;
    constructor(source: string) {
        this.animation = document.getElementById(source)!;
        this.isMobile = window.innerWidth < 600 ? true : false;
    }
    public async setAnimation(imageSource: HTMLImageElement, frames: number, framerate: number, end: string, backgroundSize = `auto ${this.isMobile ? "3" : "5"}00px`): Promise<void> {
        this.animation.style.setProperty("--bg-end", `-${(this.isMobile ? 300 : 500) * (frames - 1)}px`)
        this.animation.style.backgroundImage = `url(${imageSource.src})`;
        this.animation.style.backgroundSize = backgroundSize;
        const length = frames / framerate;
        this.animation.style.animation = `none`;
        this.animation.offsetHeight;
        this.animation.style.animation = `anim ${length}s steps(${end === "infinite" ? (frames) + ", jump-none" : frames - 1}) ${end}`;
        await new Promise(resolve => {
            this.animation.addEventListener("animationend", resolve, { once: true });
        });
    }
}