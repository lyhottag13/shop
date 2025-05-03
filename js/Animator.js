var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Animator {
    constructor(width, source) {
        this.animation = document.getElementById(source);
        this.frameWidth = width;
        this.isMobile = window.innerWidth < 600 ? true : false;
    }
    setAnimation(imageSource_1, frames_1, framerate_1, end_1) {
        return __awaiter(this, arguments, void 0, function* (imageSource, frames, framerate, end, backgroundSize = `auto ${this.isMobile ? "3" : "5"}00px`) {
            this.animation.style.setProperty("--animation-image", `url(${imageSource.src})`);
            this.animation.style.setProperty("--background-width", `${this.frameWidth * frames}`);
            this.animation.style.setProperty("--background-size", backgroundSize);
            this.animation.style.setProperty("--frames", `${frames - 1}`);
            this.animation.style.setProperty("--animation-length", `${frames / framerate}s`);
            this.animation.style.animation = `none`;
            this.animation.offsetHeight;
            this.animation.style.animation = `anim var(--animation-length) steps(var(--frames)) ${end}`;
            yield new Promise(resolve => {
                this.animation.addEventListener("animationend", resolve, { once: true });
            });
        });
    }
}
