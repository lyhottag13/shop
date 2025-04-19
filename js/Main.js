import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
const textBox = document.getElementById("text");
const closedSign = document.getElementById("closedSign");
const lightSwitch = document.getElementById("lightSwitch");
const player = new SoundManager();
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 500;
const animator = new Animator(FRAME_WIDTH);
let isTyping = true;

const AUDIO = ["wind", "generic1", "generic2"];
const IMAGES = ["Idle", "Closed"];

const images = {};

IMAGES.forEach((name) => {
    const image = new Image();
    image.src = `resources/images/${name}.webp`;
    images[name] = image;
});
const image = new Image();
image.src = `resources/images/Idle (1).png`;
images["Idle (1)"] = image;
AUDIO.forEach((name) => {
    player.load(name);
});

window.onload = async () => {
    initialize();
    animator.animate();
};

let signClicks = { number: 0 };
closedSign.addEventListener("pointerdown", () => {
    if (signClicks.number === 3) {
        display("* You observe that this sign has nothing left to observe.");
        changeAnimation("Idle (1)", 17);
        closedSign.remove();
        createButton("ali", "40%", "30%", "40%", "30%", ali);
    } else {
        display("* The sign appears to be hastily painted on with a sharpie.", signClicks);
    }
});
lightSwitch.addEventListener("pointerdown", () => {
    display("* This string has seen better days.");
});
function ali() {
    display("Hello!");
}
async function initialize() {
    await sleep(2000);
    isTyping = false;
    display("* There's nobody here...");
}
async function display(text, counter) {
    if (!isTyping) {
        textBox.textContent = "";
        isTyping = true;
        for (let i = 0; i < text.length; i++) {
            textBox.textContent += text.charAt(i);
            player.play("generic2");
            await sleep(35);
        }
        isTyping = false;
        if (counter !== undefined) {
            counter.number++;
        }
    }
}
function changeAnimation(fileName, frames) {
    document.getElementById("animation").style.backgroundSize = `${frames * FRAME_WIDTH}px ${FRAME_WIDTH}px`;
    document.getElementById("animation").style.backgroundImage = `url("resources/images/${fileName}.png")`;
    animator.setFrames(frames);
}
function createButton(id, top, left, width, height, functionName) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add("interactable");
    button.style.top = top;
    button.style.left = left;
    button.style.width = width;
    button.style.height = height;
    document.getElementById("counter").appendChild(button);
    button.addEventListener("pointerdown", functionName);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}