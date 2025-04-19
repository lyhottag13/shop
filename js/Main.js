import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
const textBox = document.getElementById("text");
const closedSign = document.getElementById("closedSign");
const lightSwitch = document.getElementById("lightSwitch");
const player = new SoundManager();
const animator = new Animator(1848);
let isTyping = true;

const AUDIO = ["wind", "generic1", "generic2"];
const IMAGES = ["Idle", "Closed"];

const images = {};

IMAGES.forEach((name) => {
    const image = new Image();
    image.src = `resources/images/${name}.webp`;
    images[name] = image;
});
AUDIO.forEach((name) => {
    player.load(name);
});

window.onload = () => {
    initialize();
};

let signClicks = { number: 0 };
closedSign.addEventListener("pointerdown", () => {
    if (signClicks.number === 3) {
        displayText("* You observe that this sign has nothing left to observe.");
        changeAnimation("Idle", 4, 17);
        closedSign.remove();
        createButton("ali", "40%", "30%", "40%", "30%", ali);
    } else {
        displayText("* The sign appears to be hastily painted on with a sharpie.", signClicks);
    }
});
lightSwitch.addEventListener("pointerdown", () => {
    displayText("* This string has seen better days.");
});
async function ali() {
    await displayText("Hello!| Welcome to my shop!# It's a little bare, but feel free to look around!");
}
async function initialize() {
    animator.setFrames(1, 1);
    animator.setAnimation(images["Closed"]);
    animator.animate();
    await sleep(2000);
    isTyping = false;
    displayText("* There's nobody here...");
}
async function displayText(text, counter) {
    if (!isTyping) {
        textBox.innerHTML = "";
        isTyping = true;
        for (let i = 0; i < text.length; i++) {
            if (text.charAt(i) === "|") {
                textBox.innerHTML += "<br>";
                await sleep(1000);
            } else if (text.charAt(i) === "#") {
                await sleep(2000);
                textBox.innerHTML = "";
            } else {
                textBox.innerHTML += text.charAt(i);
                player.play("generic2");
                await sleep(35);
            }
        }
        isTyping = false;
        if (counter !== undefined) {
            counter.number++;
        }
    }
    return;
}
function changeAnimation(fileName, framesPerRow, totalFrames) {
    animator.setFrames(framesPerRow, totalFrames);
    animator.setAnimation(images[fileName]);
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