import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
import { Shop } from "./Shop.js";
import { DialogueBox } from "./DialogueBox.js";
import { Tools } from "./Tools.js";

const isMobile = (window.innerWidth <= 600) ? true : false;
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 132;
const switchAnimator = new Animator(FRAME_WIDTH, "switchAnimation");
const counterAnimator = new Animator(FRAME_WIDTH, "counterAnimation");
const doorAnimator = new Animator(FRAME_WIDTH, "doorAnimation");

const screens = document.querySelectorAll(".screen");

const player = new SoundManager();
let dialogueBox1;
let shop;
let tools;
let isInitialized = false;
let currentScreenIndex = 0;
// This allows me to skip through all the events to quickly debug stuff.

const images = {};
const shopImages = [];
const eventHandlers = {
    switchLightsEvent,
    closedSignEvent,
    aliEvent,
    doorEvent,
};


let dialogueJSON;
let resourceJSON;

let isShowingInitialText;
window.onload = async () => {
    dialogueJSON = await (await fetch("resources/JSON/Dialogue.json")).json();
    resourceJSON = await (await (fetch("resources/JSON/Resources.json"))).json();

    preload();

    dialogueBox1 = new DialogueBox(dialogueJSON, player);
    tools = new Tools(false, true, player, dialogueBox1, eventHandlers);
    shop = new Shop(dialogueBox1, shopImages, dialogueJSON, tools);

    setScreen({ nextScreenIndex: 0, betweenScreenTime: 0 });
    document.addEventListener("click", async () => {
        startGame();
    }, { once: true });
    document.addEventListener("touchend", async () => {
        startGame();
    }, { once: true });
    await tools.sleep(3000);
    // This tells the user to click/tap if they haven't progressed past the initial black screen yet.
    if (!isInitialized) {
        isShowingInitialText = true;
        dialogueBox1.newText({ dialogueName: "startText", speed: 10, location: "textStart", playSound: false, index: isMobile ? 1 : 0 });
    }
};

function preload() {
    resourceJSON["audio"].forEach(name => {
        player.load(name);
    });
    resourceJSON["images"].forEach((name) => {
        const image = new Image();
        image.src = `resources/images/${name}.webp`;
        image.decode();
        images[name] = image;
    });
    resourceJSON["shopImages"].forEach((name, index) => {
        const image = new Image();
        image.src = `resources/images/ShopImages/${name}.webp`;
        shopImages[index] = image;
    });
}
// This starts the game when the user clicks/taps.
async function startGame() {
    if (!isInitialized) {
        isInitialized = true;
        if (player.audioContext.state === "suspended") {
            player.audioContext.resume();
        }

        // These lines show the door, the switch, and the closed sign for later.
        doorAnimator.setAnimation(images["Door"], 17, 0, "forwards");
        switchAnimator.setAnimation(images["SwitchPull1"], 1, 0, "forwards");
        counterAnimator.setAnimation(images["Closed"], 1, 0, "forwards");
        screens[1].style.display = "flex";

        // This will listen for key presses, if I press c, I initiate "skip" mode.
        document.addEventListener("keydown", event => tools.keyHandler(event));

        // If the screen is currently showing the initial text, then it'll wait a little longer.
        setScreen({
            nextScreenIndex: 1,
            betweenScreenTime: isShowingInitialText ? 1500 : 0,
            fadeOut: isShowingInitialText ? 1500 : 0,
            fadeIn: 3000
        });
        player.playBackgroundMusic("wind");
        await tools.sleep(2000);
        // TEMP Testing Shop Menu
        // shop.initializeShop();
        // TEMP
        tools.createButton("doorButton", isMobile ? "10%" : "23%", isMobile ? "30%" : "22%", isMobile ? "40%" : "57%", isMobile ? "50%" : "77%", () => tools.callEvent("doorEvent"), "door");
    }
}
// Calls events so that we don't have overlap of events.

async function doorEvent() {
    document.getElementById("doorButton").remove();
    // The door is clicked.
    player.play("doorcreak");
    await tools.sleep(1500);
    doorAnimator.setAnimation(images["Door"], 17, 13, "forwards");
    await tools.sleep(2500);
    // The door will zoom in here.
    screens[1].style.transform = "scale(2)";
    // The website swaps to the shop screen now.
    setScreen({ nextScreenIndex: 2, betweenScreenTime: 3000 });
    player.setBackgroundVolume({ endVolume: 0.3, delay: 4 });
    await tools.sleep(5000);
    tools.createButton("closedSign", isMobile ? "65%" : "62%", "5%", "90%", "20%", () => tools.callEvent("closedSignEvent"), "counter");
}
async function closedSignEvent() {
    await dialogueBox1.newText({ dialogueName: "closedSign" });
    if (dialogueBox1.openDialogues.get("closedSign").clicks === 2) {
        // Show lightswitch.
        await tools.sleep(1000);
        player.play("lightappear");
        tools.createButton("lightSwitch", "0", "80%", "7%", (isMobile) ? "60%" : "94%", () => tools.callEvent("switchLightsEvent"), "switch");
        document.getElementById("switch").style.opacity = 1;
        await tools.sleep(1500);
    }
    return;
}
async function switchLightsEvent() {
    if (!dialogueBox1.isTyping) {
        await dialogueBox1.newText({ dialogueName: "switchLights" });
        await tools.sleep(1400);
        document.getElementById("lightSwitch").remove();
        dialogueBox1.newText({ dialogueName: "switchLights" });
        // Now you see the hand.
        switchAnimator.setAnimation(images["SwitchPull1"], 14, 25, "forwards");
        document.getElementById("switchAnimation").addEventListener("animationend", () => {
            switchAnimator.setAnimation(images["SwitchPull2"], 24, 25, "forwards");
        }, { once: true });
        await tools.sleep(13 / 25 * 1000);
        // The lights activate here.
        player.stopBackgroundMusic(1);
        player.play("lightclickdown");
        counterAnimator.setAnimation(images["OpeningBusiness"], 1, 0, "forwards");
        body.style.backgroundImage = `url("${images["Background"].src}")`;
        body.style.backgroundColor = "rgb(179, 115, 10)";
        document.getElementById("closedSign").remove();
        document.getElementById("switchAnimation").style.filter = "none";
        await tools.sleep(13 / 25 * 1000);
        player.play("lightclickup");
        // Now we're displaying dialogue.
        await tools.sleep(1500 - (13 / 25 * 1000));
        await dialogueBox1.newText({ dialogueName: "switchLights" });
        await tools.sleep(1500);
        await dialogueBox1.newText({ dialogueName: "switchLights" });
        await tools.sleep(2000);
        // Now Ali takes the sign.
        counterAnimator.setAnimation(images["OpeningBusiness"], 21, 23, "forwards");
        await tools.sleep(21 / 23 * 1000 + 1500);
        await dialogueBox1.newText({ dialogueName: "switchLights" });
        await tools.sleep(1800);
        // Now Ali pops up.
        player.playBackgroundMusic("shop");
        player.setBackgroundVolume({ initialVolume: 0, endVolume: 1, delay: 0.5 });
        startHowdy();
        await tools.sleep(800);
        dialogueBox1.showAliIcon();
        dialogueBox1.newText({ dialogueName: "ali" });
        // Now Ali has thrown his sign, it is completely gone.
        tools.createButton("ali", "40%", "10%", "80%", "60%", () => tools.callEvent("aliEvent"), "counter");
    }
    return;
}
async function aliEvent() {
    if (dialogueBox1.openDialogues.get("ali").clicks === 0) {
        // This triggers if this is the first time we've talked to Ali.
        startAliAnimation();
        await dialogueBox1.newText({ dialogueName: "ali" });
        shop.initializeShop();
    } else if (!dialogueBox1.isTyping) {
        // This triggers if we're just bantering.
        shop.hide();
        await dialogueBox1.newText({ dialogueName: "ali", starting: 2 });
        shop.show();
    }
    return;
}
async function startHowdy() {
    document.getElementById("counterAnimation").style.backgroundPositionY =`-${isMobile ? "2" : "4"}00px`;
    await counterAnimator.setAnimation(images["Emerging1"], 27, 20, "forwards", `auto ${isMobile ? "6" : "10"}00px`);
    player.playSpammableSFX("explosion");
}
async function startAliAnimation() {
    await counterAnimator.setAnimation(images["Emerging2"], 18, 16, "forwards", `auto ${isMobile ? "6" : "10"}00px`);
    counterAnimator.setAnimation(images["Idle"], 17, 12, "infinite");
    document.getElementById("counterAnimation").style.backgroundPositionY = "100px";
}
/**
 * This changes the screen from the current one to the next one. It has a couple of optional
 * parameters, such as the fade out, fade in, and between screen time.
 * @param {number} nextScreenIndex - The index of the next screen.
 * @param {number} betweenScreenTime - The time between screens (black screen) in seconds.
 * @param {number} fadeOut - The fade out time in seconds.
 * @param {number} fadeIn - The fade in time in seconds.
 */
async function setScreen({
    nextScreenIndex,
    betweenScreenTime = 2000,
    fadeOut = betweenScreenTime,
    fadeIn = fadeOut
}) {
    const currentScreen = screens[currentScreenIndex];
    const nextScreen = screens[nextScreenIndex];
    currentScreen.style.setProperty("--transition-time", `${fadeOut / 1000}s`);
    nextScreen.style.setProperty("--transition-time", `${fadeIn / 1000}s`);
    currentScreen.style.opacity = 0;
    await tools.sleep(betweenScreenTime);
    currentScreen.style.transform = "";
    currentScreen.style.display = "none";
    nextScreen.style.display = "flex";
    nextScreen.offsetHeight;
    nextScreen.style.opacity = 1;
    currentScreenIndex = nextScreenIndex;
}