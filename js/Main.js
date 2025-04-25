import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";

const body = document.body;
const MOBILE = (window.innerWidth <= 600) ? true : false;
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 500;
const switchAnimator = new Animator(FRAME_WIDTH, "switchAnimation");
const counterAnimator = new Animator(FRAME_WIDTH, "animation");
const doorAnimator = new Animator(FRAME_WIDTH, "doorAnimation");
const player = new SoundManager();
let isTyping = false;
let isLightOn = false;
let isInteractionAllowed = true;
let isInitialized = false;
let currentScreenNumber = 0;
let isMenuShowing = false;
const AUDIO = ["wind", "shop", "generic1", "generic2", "lightclick", "lightappear", "doorcreak", "explosion"];
const IMAGES = ["Closed", "ClosedLights", "Idle", "OpeningBusiness", "Switch", "SwitchPull", "Background", "SwitchPull1", "SwitchPull2", "Face", "Door", "trol"];

// This allows me to skip through all the events to quickly debug stuff.
let skip = false;

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

let isShowingInitialText;
window.onload = async () => {
    setScreen(0, 0);
    document.addEventListener("click", async () => {
        if (!isInitialized) {
            initialize();
        }
    }, { once: true });
    document.addEventListener("touchend", async () => {
        if (!isInitialized) {
            initialize();
        }
    }, { once: true });
    await sleep(3000);
    if (!isInitialized) {
        isShowingInitialText = true;
        displayText((MOBILE) ? "TAP YOUR SCREEN" : "CLICK YOUR SCREEN", 10, "textStart", false);
    }
};
// This starts the game.
async function initialize() {

    isInitialized = true;
    if (player.audioContext.state === "suspended") {
        player.audioContext.resume();
    }
    // These lines show the door, the switch, and the closed sign for later.
    doorAnimator.setAnimation(images["Door"], 17, 0, "forwards");
    switchAnimator.setAnimation(images["Switch"], 1, 0, "forwards");
    counterAnimator.setAnimation(images["Closed"], 1, 0, "forwards");
    document.getElementById("screen1").style.display = "flex";
    // This will listen for key presses, if I press c, I initiate "skip" mode.
    document.addEventListener("keydown", event => keyHandler(event));
    // If the screen is currently showing the initial text, then it'll wait a little longer.
    setScreen(1, (isShowingInitialText) ? 1500 : 0, (isShowingInitialText) ? "1.5s" : "0s", "3s");
    player.playBackgroundMusic("wind");
    await sleep(2000);
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
    setScreen(2, 3000);
    player.setBackgroundVolume(-1, 0.3, 4);
    createButton("closedSign", (MOBILE) ? "65%" : "62%", "5%", "90%", "20%", () => callEvent("closedSignEvent"), "counter");
    document.getElementById("doorButton").remove();
}
async function closedSignEvent() {
    if (signClicks.number > 2) {
        await displayText("* You observe that this sign has nothing left to observe.");
    } else if (signClicks.number === 2) {
        // Show lightswitch.
        await displayText("* You observe that this sign has nothing left to observe.");
        signClicks.number++
        await sleep(1000);
        player.play("lightappear");
        createButton("lightSwitch", "0", "80%", "7%", (MOBILE) ? "60%" : "94%", () => callEvent("switchLightsEvent"), "switch");
        document.getElementById("switch").style.opacity = 1;
        await sleep(1500);
    } else if (signClicks.number === 1) {
        await displayText("* The sign's penmanship is impeccable.");
        signClicks.number++;
    } else {
        await displayText("* The sign appears to be hastily drawn on with a sharpie.");
        signClicks.number++;
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
    await displayText("Howdy, I'm Ali!|Welcome to my shop!#I'm still setting up, but feel free to stick around!#Oh, and check out my new-fangled shop too!");
    document.getElementById("shopTab").addEventListener("pointerdown", toggleMenu);
    document.getElementById("shopContainer").style.visibility = "visible";
    document.getElementById("shopContainer").style.opacity = 1;
    return;
}
async function displayText(text, speed, location, playSound) {
    if (!isTyping) {
        speed = speed ?? 1;
        location = location ?? "text";
        playSound = playSound ?? true;
        const textBox = document.getElementById(location);
        textBox.innerHTML = "";
        isTyping = true;
        let charAt;
        for (let i = 0; i < text.length; i++) {
            charAt = text.charAt(i);
            if (charAt === "|") {
                textBox.innerHTML += "<br>";
                await sleep(1000 * speed);
            } else if (charAt === "#") {
                await sleep(2000 * speed);
                textBox.innerHTML = "";
            } else if (charAt === " ") {
                textBox.innerHTML += " ";
            } else if (charAt === ",") {
                textBox.innerHTML += ",";
                await sleep(500 * speed);
            } else {
                textBox.innerHTML += charAt;
                if (playSound) {
                    player.play("generic2");
                }
                await sleep(35 * speed);
            }
        }
        isTyping = false;
    }
    return;
}
function createButton(id, top, left, width, height, functionName, div) {
    div = div ?? "counter";
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
async function setScreen(screenNumber, transitionTime, fadeOut, fadeIn) {
    fadeOut = fadeOut ?? `${transitionTime / 1000}s`;
    fadeIn = fadeIn ?? fadeOut;
    const currentScreen = document.getElementById(`screen${currentScreenNumber}`);
    const nextScreen = document.getElementById(`screen${screenNumber}`);
    currentScreen.style.setProperty("--transition-time", fadeOut);
    nextScreen.style.setProperty("--transition-time", fadeIn);
    currentScreen.style.opacity = 0;
    await sleep(transitionTime);
    currentScreen.style.transform = "";
    currentScreen.style.display = "none";
    nextScreen.style.display = "flex";
    nextScreen.offsetHeight;
    nextScreen.style.opacity = 1;
    currentScreenNumber = screenNumber;
}
function toggleMenu() {
    if (!isMenuShowing) {
        if (!MOBILE) {
            document.getElementById("shopContainer").style.right = "100px";
            document.getElementById("shopTabLabel").textContent = "CLOSE SHOP";
            document.getElementById("counter").style.transform = "translateX(-500px)";
        } else {
            document.getElementById("shopContainer").style.bottom = "30px";
            document.getElementById("shopTabLabel").textContent = "CLOSE SHOP";
            document.getElementById("counter").style.transform = "translateY(-100px)";
            document.getElementById("textDiv").style.transform = "translateY(-100px)";
            document.body.style.backgroundPositionY = "-190px";
        }
        isMenuShowing = true;
    } else {
        if (!MOBILE) {
            document.getElementById("shopContainer").style.right = "-900px";
            document.getElementById("shopTabLabel").textContent = "OPEN SHOP";
            document.getElementById("counter").style.transform = "translateX(0)";
        } else {
            document.getElementById("shopContainer").style.bottom = "-250px";
            document.getElementById("shopTabLabel").textContent = "OPEN SHOP";
            document.getElementById("counter").style.transform = "translateY(0)";
            document.getElementById("textDiv").style.transform = "translateY(0)";
            document.body.style.backgroundPositionY = "0";
        }
        isMenuShowing = false;
    }
    
}
function keyHandler(event) {
    switch (event.key) {
        case "c":
            skip = !skip;
            break;
        case "e":
            player.playSpammableSFX("explosion");
    }
}
function sleep(ms) {
    ms = (skip) ? 10 : ms;
    return new Promise(resolve => setTimeout(resolve, ms));
}