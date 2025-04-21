import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
const textBox = document.getElementById("text");
const body = document.body;
const closedSign = document.getElementById("closedSign");
const MOBILE = (window.innerWidth <= 600) ? true : false;
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 500;
const player = new SoundManager();
const counterAnimator = new Animator(FRAME_WIDTH, "animation");
const switchAnimator = new Animator(FRAME_WIDTH, "switchAnimation");
let isTyping = true;
let isLightOn = false;
let isInteractionAllowed = true;

const AUDIO = ["wind", "shop", "generic1", "generic2"];
const IMAGES = ["Closed", "ClosedLights", "Idle", "OpeningBusiness", "Switch", "SwitchPull"];

const images = {};
const eventHandlers = {
    switchLightsEvent,
    closedSignEvent,
    signGoneEvent,
    aliEvent,
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
    switchAnimator.setAnimation(images["Switch"], 1, 1, "forwards");
    counterAnimator.setAnimation(images["Closed"], 1, 1, "forwards");
    document.body.addEventListener("click", () => {
        initialize();
    }, { once: true });
};

let signClicks = { number: 0 };
async function callEvent(eventName) {
    if (isInteractionAllowed) {
        isInteractionAllowed = false;
        await eventHandlers[eventName]();
        isInteractionAllowed = true;
    }
}
async function switchLightsEvent() {
    if (!isTyping) {
        if (!isLightOn) {
            displayText("* ?");
            const totalFrames = 28;
            const fps = 25;
            switchAnimator.setAnimation(images["SwitchPull"], totalFrames, fps, "forwards");
            await sleep(13 / fps * 1000);
            counterAnimator.setAnimation(images["ClosedLights"], 1, 1, "forwards");
            body.style.backgroundImage = "url('resources/images/Background.webp')";
            body.style.backgroundColor = "rgb(179, 115, 10)";
            isLightOn = true;
            player.stopBackgroundMusic();
            await sleep(1500);
        }
        await displayText("* The switch is now on.");
    }
    return;
}
async function closedSignEvent() {
    if (signClicks.number > 1 && isLightOn === true) {
        displayText("* ?");
        counterAnimator.setAnimation(images["OpeningBusiness"], 21, 23, "forwards");
        document.getElementById("closedSign").remove();
        await sleep(21 / 23 * 1000 + 1000);
        createButton("signGone", "40%", "30%", "40%", "30%", () => callEvent("signGoneEvent"), "counter");
        await displayText("* The sign has mysteriously vanished.");
    } else if (signClicks.number > 1) {
        await displayText("* You observe that this sign has nothing left to observe.", signClicks);
    } else if (signClicks.number === 1) {
        document.getElementById("switch").style.opacity = 1;
        createButton("lightSwitch", "0", "80%", "7%", (MOBILE) ? "60%" : "94%", () => callEvent("switchLightsEvent"), "switch");
        await displayText("* You observe that this sign has nothing left to observe.", signClicks);
    } else {
        await displayText("* The sign appears to be hastily painted on with a sharpie.", signClicks);
    }
    return;
}
async function signGoneEvent() {
    await displayText("* You peer over the counter...");
    await sleep(1800);
    player.playBackgroundMusic("shop");
    counterAnimator.setAnimation(images["Idle"], 17, 12, "infinite");
    document.getElementById("signGone").remove();
    createButton("ali", "40%", "30%", "40%", "30%", () => callEvent("aliEvent"), "counter");
    return;
}
async function aliEvent() {
    await displayText("Howdy, I'm Ali!|Welcome to my shop!#I'm still setting up, but feel free to look around!");
    return;
}
async function initialize() {
    player.playBackgroundMusic("wind");
    isTyping = false;
    await displayText("* There's nobody here...");
    createButton("closedSign", (MOBILE) ? "65%" : "62%", "32%", "36%", "9%", () => callEvent("closedSignEvent"), "counter");
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
function createButton(id, top, left, width, height, functionName, div) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add("interactable");
    button.style.top = top;
    button.style.left = left;
    button.style.width = width;
    button.style.height = height;
    document.getElementById(div).appendChild(button);
    button.addEventListener("pointerdown", functionName);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}