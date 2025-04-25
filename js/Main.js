import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
const textBox = document.getElementById("text");
const body = document.body;
const MOBILE = (window.innerWidth <= 600) ? true : false;
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 500;
const switchAnimator = new Animator(FRAME_WIDTH, "switchAnimation");
const counterAnimator = new Animator(FRAME_WIDTH, "animation");
const doorAnimator = new Animator(FRAME_WIDTH, "doorAnimation");
const player = new SoundManager();
let isTyping = true;
let isLightOn = false;
let isInteractionAllowed = true;
let isInitialized = false;
let currentScreen = 1;
const AUDIO = ["wind", "shop", "generic1", "generic2", "lightclick", "lightappear", "doorcreak"];
const IMAGES = ["Closed", "ClosedLights", "Idle", "OpeningBusiness", "Switch", "SwitchPull", "Background", "SwitchPull1", "SwitchPull2", "Face", "Door"];

const images = {};
const eventHandlers = {
    switchLightsEvent,
    closedSignEvent,
    aliEvent,
    doorEvent,
};
player.construct();
AUDIO.forEach(name => {
    player.load(name);
});

IMAGES.forEach((name) => {
    const image = new Image();
    image.src = `resources/images/${name}.webp`;
    images[name] = image;
});


window.onload = async () => {
    doorAnimator.setAnimation(images["Door"], 17, 0, "forwards");
    switchAnimator.setAnimation(images["Switch"], 1, 0, "forwards");
    counterAnimator.setAnimation(images["Closed"], 1, 0, "forwards");
    document.getElementById("screen1").style.display = "flex";
    document.addEventListener("click", async () => {
        if (!isInitialized) {
            isInitialized = true;
            if (player.audioContext.state === "suspended") {
                player.audioContext.resume();
            }
            initialize();
        }
    }, { once: true });
    document.addEventListener("touchend", async () => {
        if (!isInitialized) {
            isInitialized = true;

            if (player.audioContext.state === "suspended") {
                player.audioContext.resume();
            }
            initialize();
        }
    }, { once: true });
};
// Starts the game, sets the screen, and plays the background audio.
async function initialize() {
    setScreen(1, 0);
    // await sleep(300);
    player.playBackgroundMusic("wind");
    createButton("doorButton", (MOBILE) ? "10%" : "23%", (MOBILE) ? "30%" : "22%", (MOBILE) ? "40%" : "57%", (MOBILE) ? "50%" : "77%", () => callEvent("doorEvent"), "door");
}
let signClicks = { number: 0 };
// Calls events so that we don't have overlap of events.
async function callEvent(eventName) {
    if (isInteractionAllowed) {
        isInteractionAllowed = false;
        await eventHandlers[eventName]();
        isInteractionAllowed = true;
    }
}
async function doorEvent() {
    // The door is clicked.
    isTyping = false;
    player.play("doorcreak");
    await sleep(1500);
    doorAnimator.setAnimation(images["Door"], 17, 13, "forwards");
    await sleep(2500);
    // The door will zoom in here.
    document.getElementById("screen1").style.transform = "scale(2)";
    // The website swaps to the other screen now.
    setScreen(2, 4000);
    player.setBackgroundVolume(-1, 0.3, 4);
    createButton("closedSign", (MOBILE) ? "65%" : "62%", "5%", "90%", "20%", () => callEvent("closedSignEvent"), "counter");
    document.getElementById("doorButton").remove();

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
            // Now you see the hand.
            switchAnimator.setAnimation(images["SwitchPull1"], 14, 25, "forwards");
            document.getElementById("switchAnimation").addEventListener("animationend", () => {
                switchAnimator.setAnimation(images["SwitchPull2"], 24, 25, "forwards");
            }, { once: true });
            await sleep(13 / 25 * 1000);
            // The lights activate here.
            player.stopBackgroundMusic(1);
            player.play("lightclick");
            counterAnimator.setAnimation(images["ClosedLights"], 1, 0, "forwards");
            body.style.backgroundImage = `url("${images["Background"].src}")`;
            body.style.backgroundColor = "rgb(179, 115, 10)";
            isLightOn = true;
            document.getElementById("closedSign").remove();
            document.getElementById("switchAnimation").style.filter = "none";
            await sleep(1500);
            await displayText("* The switch is now on.");
            await sleep(1500);
            await displayText("* You hear shuffling behind the counter.");
            await sleep(2000);
            counterAnimator.setAnimation(images["OpeningBusiness"], 21, 23, "forwards");
            await sleep(21 / 23 * 1000 + 1500);
            await displayText("* The sign is now gone.#* You decide to take a peek...");
            await sleep(1800);
            player.playBackgroundMusic("shop");
            player.setBackgroundVolume(0, 1, 0.5);
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
// Sets a screen so that I can use this between any two screens.
async function setScreen(screenNumber, transitionTime) {
    document.getElementById(`screen${currentScreen}`).style.opacity = 0;
    await sleep(transitionTime);
    document.getElementById(`screen${currentScreen}`).style.transform = "";
    document.getElementById(`screen${currentScreen}`).style.display = "none";
    document.getElementById(`screen${screenNumber}`).style.display = "flex";
    document.getElementById(`screen${screenNumber}`).offsetHeight;
    document.getElementById(`screen${screenNumber}`).style.opacity = 1;
    currentScreen = screenNumber;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}