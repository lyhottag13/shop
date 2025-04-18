export class Animator {
    constructor(width) {
        this.canvas = document.getElementById("animation");
        this.ctx = this.canvas.getContext("2d");
        this.index = 1;
        this.viewX = 0;
        this.viewY = 0;
        this.framesPerRow = 1;
        this.totalFrames = 1;
        this.frameWidth = width;
        this.frameHeight = width;
        this.FRAMERATE = 12;
        this.animationSource = null;
        this.ctx.imageSmoothingEnabled = false;
        this.start;
    }
    animate1 = (timestamp) => {
        if (this.start === undefined) {
            this.start = timestamp;
        } else if (timestamp - this.start > 1000 / this.FRAMERATE) {
            this.start = timestamp;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.animationSource, this.viewX, this.viewY, this.frameWidth, this.frameHeight, 0, 0, 500, 500);
            this.index = (this.index + 1) % (this.totalFrames);
            this.viewX = (this.index % this.framesPerRow) * this.frameWidth;
            this.viewY = Math.floor(this.index / (this.framesPerRow)) * this.frameHeight;
        }
        requestAnimationFrame(this.animate1);
    }
    animate() {
        requestAnimationFrame(this.animate1);
    }
    setFrames(framesPerRow, totalFrames) {
        this.framesPerRow = framesPerRow;
        this.totalFrames = totalFrames;
    }
    stop() {
        this.animationSource = null;
    }
    setAnimation(animationSource) {
        this.animationSource = animationSource;
    }
}