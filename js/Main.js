import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
const textBox = document.getElementById("text");
const closedSign = document.getElementById("closedSign");
const lightSwitch = document.getElementById("lightSwitch");
const player = new SoundManager();
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 500;
const animator = new Animator(FRAME_WIDTH, "animation");
const animator2 = new Animator(FRAME_WIDTH, "switchAnimation");
let isTyping = true;
let isLightOn = false;

const AUDIO = ["wind", "generic1", "generic2"];
const IMAGES = ["Closed", "ClosedLights", "Idle", "OpeningBusiness", "Switch", "SwitchPull"];
const EVENTS = ["closedSign", "switchLights"];

const images = {};
const eventHandlers = {
    switchLightsEvent,
    closedSignEvent,
    signGoneEvent,
};
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
    callEvent("closedSignEvent");
});
lightSwitch.addEventListener("pointerdown", () => {
    callEvent("switchLightsEvent");
});
function callEvent(eventName) {
    eventHandlers[eventName]();
}
async function closedSignEvent() {
    if (!isTyping) {
        if (signClicks.number === 1 && isLightOn === true) {
            displayText("* ?");
            animator.setAnimation(images["OpeningBusiness"], 21, 23, "forwards");
            closedSign.remove();    
            await sleep(21 / 23 * 1000);
            createButton("signGone", "40%", "30%", "40%", "30%", signGoneEvent);
        } else if (signClicks.number === 1) {
            displayText("* You observe that this sign has nothing left to observe.");
        } else {
            displayText("* The sign appears to be hastily painted on with a sharpie.", signClicks);
        }
    }
}
async function switchLightsEvent() {
    if (!isTyping) {
        if (!isLightOn) {
            displayText("* ?");
            const totalFrames = 28;
            const fps = 20;
            animator2.setAnimation(images["SwitchPull"], totalFrames, fps, "forwards");
            await sleep(13 / fps * 1000);
            isLightOn = true;
            player.stop();
            document.body.style.backgroundColor = "rgb(226, 182, 117)";
        } else {
            displayText("* The switch is now on.");
        }
    }
}
async function signGoneEvent() {
    displayText("* The sign has mysteriously disappeared.");
    await sleep(2000);
    animator.setAnimation(images["Idle"], 17, 12, "infinite");
    document.getElementById("signGone").remove();
    createButton("ali", "40%", "30%", "40%", "30%", ali);
}
async function ali() {
    displayText("Hello!|Welcome to my shop!#It's a little bare, but feel free to look around!");
}
async function initialize() {
    animator2.setAnimation(images["Switch"], 1, 1, "forwards");
    animator.setAnimation(images["ClosedLights"], 1, 1, "forwards");
    await sleep(2000);
    player.playBackgroundMusic("wind");
    isTyping = false;
    await displayText("* There's nobody here...");
}
async function displayText(text, counter) {
    if (!isTyping) {
        textBox.innerHTML = "";
        isTyping = true;
        let charAt;
        for (let i = 0; i < text.length; i++) {
            charAt = text.charAt(i);
            if (charAt === "|") {
                textBox.innerHTML += "<br>";
                await sleep(1000);
            } else if (charAt === "#") {
                await sleep(2000);
                textBox.innerHTML = "";
            } else if (charAt === " ") {
                textBox.innerHTML += " ";
            } else {
                textBox.innerHTML += charAt;
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
function createButton(id, top, left, width, height, functionName) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add("interactable");
    button.style.top = top;
    button.style.left = left;
    button.style.width = width;
    button.style.height = height;
    button.style.zIndex = 100;
    document.getElementById("counter").appendChild(button);
    button.addEventListener("pointerdown", functionName);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}