import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
const textBox = document.getElementById("text");
const body = document.body;
const MOBILE = (window.innerWidth <= 600) ? true : false;
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 500;
const switchAnimator = new Animator(FRAME_WIDTH, "switchAnimation");
const counterAnimator = new Animator(FRAME_WIDTH, "animation");
const player = new SoundManager();
let isTyping = true;
let isLightOn = false;
let isInteractionAllowed = true;

const AUDIO = ["wind", "shop", "generic1", "generic2", "lightclick", "lightappear"];
const IMAGES = ["Closed", "ClosedLights", "Idle", "OpeningBusiness", "Switch", "SwitchPull", "Background", "SwitchPull1", "SwitchPull2", "Face"];

const images = {};
const eventHandlers = {
    switchLightsEvent,
    closedSignEvent,
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
    document.body.addEventListener("pointerdown", () => {
        initialize();
    }, { once: true });
};
async function initialize() {
    player.playBackgroundMusic("wind");
    isTyping = false;
    await displayText("* There's nobody here...");
    createButton("closedSign", (MOBILE) ? "65%" : "62%", "5%", "90%", "20%", () => callEvent("closedSignEvent"), "counter");
}
let signClicks = { number: 0 };
async function callEvent(eventName) {
    if (isInteractionAllowed) {
        isInteractionAllowed = false;
        await eventHandlers[eventName]();
        isInteractionAllowed = true;
    }
}
async function closedSignEvent() {
    if (signClicks.number > 2) {
        await displayText("* You observe that this sign has nothing left to observe.");
    } else if (signClicks.number === 2) {
        // Show lightswitch.
        await displayText("* You observe that this sign has nothing left to observe.", signClicks);
        await sleep(1000);
        player.play("lightappear");
        createButton("lightSwitch", "0", "80%", "7%", (MOBILE) ? "60%" : "94%", () => callEvent("switchLightsEvent"), "switch");
        document.getElementById("switch").style.opacity = 1;
        await sleep(1500);
    } else if (signClicks.number === 1) {
        await displayText("* The sign's penmanship is impeccable.", signClicks);
    } else {
        await displayText("* The sign appears to be hastily drawn on with a sharpie.", signClicks);
    }
    return;
}
async function switchLightsEvent() {
    if (!isTyping) {
        if (!isLightOn) {
            await displayText("* The switch is too high to reach.");
            await sleep(1400);
            document.getElementById("lightSwitch").remove();
            displayText("* ?");
            switchAnimator.setAnimation(images["SwitchPull1"], 14, 25, "forwards");
            document.getElementById("switchAnimation").addEventListener("animationend", () => {
                switchAnimator.setAnimation(images["SwitchPull2"], 24, 25, "forwards");
            }, { once: true });
            await sleep(13 / 25 * 1000);
            // Lights activate here.
            player.play("lightclick");
            player.stopBackgroundMusic();
            counterAnimator.setAnimation(images["ClosedLights"], 1, 1, "forwards");
            body.style.backgroundImage = `url("${images["Background"].src}")`;
            body.style.backgroundColor = "rgb(179, 115, 10)";
            isLightOn = true;
            document.getElementById("closedSign").remove();
            await sleep(1500);
            await displayText("* The switch is now on.");
            await sleep(1500);
            await displayText("* You hear shuffling behind the counter.");
            await sleep(2000);
            counterAnimator.setAnimation(images["OpeningBusiness"], 21, 23, "forwards");
            await sleep(21 / 23 * 1000 + 1500);
            await displayText("* You are filled with CURIOSITY.#* You decide to take a peek...");
            await sleep(1800);
            player.playBackgroundMusic("shop");
            counterAnimator.setAnimation(images["Idle"], 17, 12, "infinite");
            createButton("ali", "40%", "10%", "80%", "60%", () => callEvent("aliEvent"), "counter");
        } else {
            await displayText("* The switch is now on.");
        }
    }
    return;
}

async function aliEvent() {
    await displayText("Howdy, I'm Ali!|Welcome to my shop!#I'm still setting up, but feel free to stick around!");
    return;
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
            } else if (charAt === ",") {
                textBox.innerHTML += ",";
                await sleep(500);
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