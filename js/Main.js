import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";
import { Shop } from "./Shop.js";
import { DialogueBox } from "./DialogueBox.js";
import { Tools } from "./Tools.js";
import { EventHandler } from "./EventHandler.js";
import { EventList } from "./EventList.js";

const isMobile = (window.innerWidth <= 600) ? true : false;
const switchAnimator = new Animator("switchAnimation");
const counterAnimator = new Animator("counterAnimation");
const doorAnimator = new Animator("doorAnimation");

const player = new SoundManager();
let dialogueBox1;
let shop;
let tools;
let eventHandler;
let eventList;
let isInitialized = false;
// This allows me to skip through all the events to quickly debug stuff.

const images = {};
const shopImages = [];


let dialogueJSON;
let resourceJSON;

let isShowingInitialText;

window.onload = async () => {
    dialogueJSON = await (await fetch("resources/JSON/Dialogue.json")).json();
    resourceJSON = await (await (fetch("resources/JSON/Resources.json"))).json();

    preload();

    createObjects();

    tools.setScreen({ nextScreenIndex: 0, betweenScreenTime: 0 });
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

function createObjects() {
    dialogueBox1 = new DialogueBox(dialogueJSON, player, images);
    tools = new Tools(0, false, player, dialogueBox1);
    eventHandler = new EventHandler({tools: tools });
    shop = new Shop(shopImages, dialogueJSON, tools, eventHandler);
    eventList = new EventList(player, tools, dialogueBox1, eventHandler, switchAnimator, counterAnimator, doorAnimator, shop, images);
    eventHandler.setList(eventList.getList());
    shop.setList(eventList.getList());
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

        // This will listen for key presses, if I press c, I initiate "skip" mode.
        document.addEventListener("keydown", event => tools.keyHandler(event));

        // If the screen is currently showing the initial text, then it'll wait a little longer.
        tools.setScreen({
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
        tools.createButton("doorButton", isMobile ? "10%" : "23%", isMobile ? "30%" : "22%", isMobile ? "40%" : "57%", isMobile ? "50%" : "77%", () => eventHandler.callEvent("doorEvent"), "door");
    }
}
