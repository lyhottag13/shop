import { SoundManager } from "./SoundManager.js";
import { Animator } from "./Animator.js";

const body = document.body;
const MOBILE = (window.innerWidth <= 600) ? true : false;
const FRAME_WIDTH = (window.innerWidth <= 600) ? 300 : 500;
const switchAnimator = new Animator(FRAME_WIDTH, "switchAnimation");
const counterAnimator = new Animator(FRAME_WIDTH, "animation");
const doorAnimator = new Animator(FRAME_WIDTH, "doorAnimation");

const screens = document.querySelectorAll(".screen");

const shopContainer = document.getElementById("shopContainer");
const shopTab = document.getElementById("shopTab");
const shopMenu = document.getElementById("shopMenu");

const counter = document.getElementById("counter");
const dialogueBox = document.getElementById("textDiv");


const player = new SoundManager();
let isTyping = false;
let isInteractionAllowed = true;
let isInitialized = false;
let currentScreenIndex = 0;
let isMenuShowing = false;
const AUDIO = ["wind", "shop", "generic1", "generic2", "lightclick", "lightappear", "doorcreak", "explosion"];
const IMAGES = ["Closed", "ClosedLights", "Idle", "OpeningBusiness", "Switch", "SwitchPull", "Background", "SwitchPull1", "SwitchPull2", "Face", "Door"];

// This allows me to skip through all the events to quickly debug stuff.
let skip = false;



const images = {};
const shopImages = {};
const eventHandlers = {
    switchLightsEvent,
    closedSignEvent,
    aliEvent,
    doorEvent,
};
player.construct();


const openDialogues = new Map();

let dialogue;

let isShowingInitialText;
window.onload = async () => {
    dialogue = await (await fetch("js/Dialogue.json")).json();
    const image = await (await (fetch("Resources.json"))).json();
    AUDIO.forEach(name => {
        player.load(name);
    });
    image["images"].forEach((name) => {
        const image = new Image();
        image.src = `resources/images/${name}.webp`;
        images[name] = image;
    });
    image["shopImages"].forEach((name, index) => {
        const image = new Image();
        image.src = `resources/images/${name}.webp`;
        shopImages[index] = image;
    });

    setScreen({ nextScreenIndex: 0, betweenScreenTime: 0 });
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
        newText({ dialogueName: "startText", speed: 10, location: "textStart", playSound: false, index: MOBILE ? 1 : 0 });
    }
};

let currentShopIndex = 0;
const arrayOfItems = document.querySelectorAll(".shopItem");

// This starts the game when the user clicks/taps.
async function initialize() {
    isInitialized = true;
    if (player.audioContext.state === "suspended") {
        player.audioContext.resume();
    }
    // These lines show the door, the switch, and the closed sign for later.
    doorAnimator.setAnimation(images["Door"], 17, 0, "forwards");
    switchAnimator.setAnimation(images["Switch"], 1, 0, "forwards");
    counterAnimator.setAnimation(images["Closed"], 1, 0, "forwards");
    screens[1].style.display = "flex";

    // This will listen for key presses, if I press c, I initiate "skip" mode.
    document.addEventListener("keydown", event => keyHandler(event));

    // If the screen is currently showing the initial text, then it'll wait a little longer.
    setScreen({
        nextScreenIndex: 1,
        betweenScreenTime: isShowingInitialText ? 1500 : 0,
        fadeOut: isShowingInitialText ? 1500 : 0,
        fadeIn: 3000
    });
    player.playBackgroundMusic("wind");
    await sleep(2000);
    // TEMP Testing Shop Menu
    // shopTab.addEventListener("pointerdown", toggleMenu);
    // shopContainer.style.visibility = "visible";
    // shopContainer.style.opacity = 1;
    // arrayOfItems.forEach((item, itemIndex) => {
    //     // This shows the 0th shop item by default.
    //     if (itemIndex === 0) {
    //         document.querySelectorAll("#description span")[0].textContent = `${dialogue["itemDescription"][0]}`;
    //         document.querySelectorAll("#description span")[1].textContent = `${dialogue["itemDescription"][1]}`;
    //         item.style.visibility = "visible";
    //     } else {
    //         item.style.visibility = "hidden";
    //         item.style.transform = `translate${MOBILE ? "X(300" : "Y(300"}px)`;
    //     }
    //     // If any shop item is clicked, then it will trigger the dialogue.
    //     item.addEventListener("pointerdown", async () => {
    //         toggleMenu();
    //         shopContainer.style.opacity = 0;
    //         shopTab.removeEventListener("pointerdown", toggleMenu);
    //         await newText({ dialogueName: "shopItems", index: itemIndex > 3 ? MOBILE ? 1 : 0 : itemIndex + 2 });
    //         shopContainer.style.opacity = 1;
    //         shopTab.addEventListener("pointerdown", toggleMenu);
    //     });
    // });
    // document.querySelectorAll(".arrow").forEach((arrow, arrowIndex) => {
    //     if (arrowIndex === 0) {
    //         arrow.querySelector("img").style.transform = `rotate(${MOBILE ? "0" : "90deg"})`;
    //     } else {
    //         arrow.querySelector("img").style.transform = `rotate(${MOBILE ? "180deg" : "270deg"})`
    //     }
    //     arrow.addEventListener("pointerdown", () => {
    //         // arrayOfItems[currentShopItem].style.visibility = "hidden";
    //         // This will increment the shop item currently showing.
    //         // This clamps the index so it doesn't go out of range.
    //         // currentShopItem = Math.max(0, Math.min(arrayOfItems.length - 1, currentShopItem));
    //         if (arrowIndex === 0 && currentShopItem !== 0) {
    //             arrayOfItems[currentShopItem].style.transform = `translate${MOBILE ? "X(200" : "Y(200"}px)`;
    //             arrayOfItems[currentShopItem].style.filter = "opacity(0)";
    //             currentShopItem--;
    //             arrayOfItems[currentShopItem].style.transform = `translate${MOBILE ? "X(0" : "Y(0"})`;
    //             arrayOfItems[currentShopItem].style.filter = "opacity(1)";
    //         } else if (arrowIndex === 1 && currentShopItem !== arrayOfItems.length - 1) {
    //             arrayOfItems[currentShopItem].style.transform = `translate${MOBILE ? "X(-200" : "Y(-200"}px)`;
    //             arrayOfItems[currentShopItem].style.filter = "opacity(0)";
    //             currentShopItem++;
    //             arrayOfItems[currentShopItem].style.transform = `translate${MOBILE ? "X(0" : "Y(0"})`;
    //             arrayOfItems[currentShopItem].style.filter = "opacity(1)";
    //         }
    //         arrayOfItems[currentShopItem].style.visibility = "visible";
    //         document.querySelectorAll("#description span")[0].textContent = dialogue["itemDescription"][Math.min(currentShopItem * 2, dialogue["itemDescription"].length - 1)];
    //         document.querySelectorAll("#description span")[1].textContent = dialogue["itemDescription"][Math.min(currentShopItem * 2 + 1, dialogue["itemDescription"].length - 1)];
    //     });
    // });
    // TEMP
    createButton("doorButton", MOBILE ? "10%" : "23%", MOBILE ? "30%" : "22%", MOBILE ? "40%" : "57%", MOBILE ? "50%" : "77%", () => callEvent("doorEvent"), "door");
}
// Calls events so that we don't have overlap of events.
async function callEvent(eventName) {
    if (isInteractionAllowed) {
        isInteractionAllowed = false;
        await eventHandlers[eventName]();
        isInteractionAllowed = true;
    }
}
async function doorEvent() {
    document.getElementById("doorButton").remove();
    // The door is clicked.
    isTyping = false;
    player.play("doorcreak");
    await sleep(1500);
    doorAnimator.setAnimation(images["Door"], 17, 13, "forwards");
    await sleep(2500);
    // The door will zoom in here.
    document.getElementById("screen1").style.transform = "scale(2)";
    // The website swaps to the other screen now.
    setScreen({ nextScreenIndex: 2, betweenScreenTime: 3000 });
    player.setBackgroundVolume(-1, 0.3, 4);
    await sleep(5000);
    createButton("closedSign", MOBILE ? "65%" : "62%", "5%", "90%", "20%", () => callEvent("closedSignEvent"), "counter");

}
async function closedSignEvent() {
    await newText({ dialogueName: "closedSign" });
    if (openDialogues.get("closedSign").clicks === 2) {
        // Show lightswitch.
        await sleep(1000);
        player.play("lightappear");
        createButton("lightSwitch", "0", "80%", "7%", (MOBILE) ? "60%" : "94%", () => callEvent("switchLightsEvent"), "switch");
        document.getElementById("switch").style.opacity = 1;
        await sleep(1500);
    }
    return;
}
async function switchLightsEvent() {
    if (!isTyping) {
        await newText({ dialogueName: "switchLights" });
        await sleep(1400);
        document.getElementById("lightSwitch").remove();
        newText({ dialogueName: "switchLights" });
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
        document.getElementById("closedSign").remove();
        document.getElementById("switchAnimation").style.filter = "none";
        // Now we're displaying dialogue.
        await sleep(1500);
        await newText({ dialogueName: "switchLights" });
        await sleep(1500);
        await newText({ dialogueName: "switchLights" });
        await sleep(2000);
        // Now Ali takes the sign.
        counterAnimator.setAnimation(images["OpeningBusiness"], 21, 23, "forwards");
        await sleep(21 / 23 * 1000 + 1500);
        await newText({ dialogueName: "switchLights" });
        await sleep(1800);
        // Now Ali pops up.
        player.playBackgroundMusic("shop");
        player.setBackgroundVolume(0, 1, 0.5);
        counterAnimator.setAnimation(images["Idle"], 17, 12, "infinite");
        createButton("ali", "40%", "10%", "80%", "60%", () => callEvent("aliEvent"), "counter");
    }
    return;
}
async function aliEvent() {
    if (!openDialogues.get("ali")) {
        // This triggers if this is the first time we've talked on Ali.
        const descriptionParts = document.querySelectorAll("#description span");
        await newText({ dialogueName: "ali" });
        shopTab.addEventListener("pointerdown", toggleMenu);
        shopContainer.style.visibility = "visible";
        shopContainer.style.opacity = 1;
        arrayOfItems.forEach((item, itemIndex) => {
            // This shows the 0th shop item by default.
            if (itemIndex === 0) {
                descriptionParts[0].textContent = dialogue["itemHeader"][0];
                descriptionParts[1].textContent = dialogue["itemDescription"][0];
                item.style.visibility = "visible";
            } else {
                item.style.visibility = "hidden";
                item.style.transform = `translate${MOBILE ? "X" : "Y"}(300px)`;
            }
            // If any shop item is clicked, then it will trigger the dialogue.
            item.addEventListener("pointerdown", async () => {
                toggleMenu();
                shopContainer.style.opacity = 0;
                shopTab.removeEventListener("pointerdown", toggleMenu);
                await newText({ dialogueName: "itemDialogue", index: itemIndex });
                shopContainer.style.opacity = 1;
                shopTab.addEventListener("pointerdown", toggleMenu);
            });
        });
        document.querySelectorAll(".arrow").forEach((arrow, arrowIndex) => {
            const arrowImage = arrow.querySelector("img");
            if (arrowIndex === 0) {
                arrowImage.style.transform = `rotate(${MOBILE ? "0" : "90deg"})`;
            } else {
                arrowImage.style.transform = `rotate(${MOBILE ? "180deg" : "270deg"})`
            }
            const direction = arrowIndex === 0 ? "" : "-";
            const displacement = `${direction}200px`;
            arrow.addEventListener("pointerdown", () => {
                const isValidMove = ((arrowIndex === 0 && currentShopIndex !== 0) || (arrowIndex === 1 && currentShopIndex !== arrayOfItems.length - 1));
                if (isValidMove) {
                    arrayOfItems[currentShopIndex].style.transform = `translate${MOBILE ? "X" : "Y"}(${displacement})`;
                    arrayOfItems[currentShopIndex].style.filter = "opacity(0)";
                    currentShopIndex += arrowIndex === 0 ? -1 : 1;
                }
                arrayOfItems[currentShopIndex].style.transform = `translate${MOBILE ? "X" : "Y"}(0)`;
                arrayOfItems[currentShopIndex].style.filter = "opacity(1)";
                arrayOfItems[currentShopIndex].style.visibility = "visible";
                const validIndex = Math.min(currentShopIndex, dialogue["itemHeader"].length - 1);
                descriptionParts[0].textContent = dialogue["itemHeader"][validIndex];
                descriptionParts[1].textContent = dialogue["itemDescription"][validIndex];
            });
        });
    } else {
        // This triggers if we're just bantering.
        if (isMenuShowing) {
            toggleMenu();
        }
        shopContainer.style.opacity = 0;
        shopTab.removeEventListener("pointerdown", toggleMenu);
        await newText({ dialogueName: "ali", starting: 1 });
        shopContainer.style.opacity = 1;
        shopTab.addEventListener("pointerdown", toggleMenu);
    }
    return;
}
async function displayText({text, speed = 1, location = "text", playSound = true}) {
    if (!isTyping) {
        const textBox = document.getElementById(location);
        textBox.innerHTML = "";
        isTyping = true;
        let charAt;
        for (let i = 0; i < text.length; i++) {
            charAt = text.charAt(i);
            switch (charAt) {
                case "|":
                    textBox.innerHTML += "<br>";
                    await sleep(700 * speed);
                    break;
                case "#":
                    await sleep(1200 * speed);
                    textBox.innerHTML = "";
                    break;
                case " ":
                    textBox.innerHTML += " ";
                    break;
                case ",":
                    textBox.innerHTML += ",";
                    await sleep(500 * speed);
                    break;
                case "!":
                case ".":
                case "?":
                    textBox.innerHTML += charAt;
                    await sleep(500 * speed);
                    break;
                default:
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
/**
 * Keeps track of how many times an item has been clicked and displays updating text to match.
 * @param {string} dialogueName - The name of the dialogue event to display.
 * @param {number} speed - The speed of the text, inversely proportional to the number input.
 * @param {string} location - The div location where the text will be displayed.
 * @param {boolean} playSound - Indicates whether or not this should play a sound.
 * @returns Null, just gives more control over when to continue with certain actions in cutscenes.
 */
async function newText({ dialogueName, speed, location, playSound, starting: startingIndex, index }) {
    let openedDialogue = openDialogues.get(dialogueName);
    if (openedDialogue) {
        openedDialogue.clicks++;
    } else {
        openedDialogue = { clicks: 0 };
        openDialogues.set(dialogueName, openedDialogue);
    }
    const numberOfDialogues = dialogue[dialogueName].length;
    const currentIndex = Math.min(numberOfDialogues - 1, openedDialogue.clicks);
    // If an index is selected, then we use the index. Else, we clamp it.
    const validIndex = index ?? (startingIndex ? (Math.floor(Math.random() * (numberOfDialogues - startingIndex)) + startingIndex) : currentIndex);
    const textToDisplay = dialogue[dialogueName][validIndex];
    await displayText({
        text: textToDisplay, 
        speed: speed, 
        location: location, 
        playSound: playSound
    });
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
    const currentScreen = document.getElementById(`screen${currentScreenIndex}`);
    const nextScreen = document.getElementById(`screen${nextScreenIndex}`);
    currentScreen.style.setProperty("--transition-time", `${fadeOut / 1000}s`);
    nextScreen.style.setProperty("--transition-time", `${fadeIn / 1000}s`);
    currentScreen.style.opacity = 0;
    await sleep(betweenScreenTime);
    currentScreen.style.transform = "";
    currentScreen.style.display = "none";
    nextScreen.style.display = "flex";
    nextScreen.offsetHeight;
    nextScreen.style.opacity = 1;
    currentScreenIndex = nextScreenIndex;
}
function toggleMenu() {
    const shopTabLabel = document.getElementById("shopTabLabel");
    if (!isMenuShowing) {
        if (!MOBILE) {
            shopContainer.style.right = "100px";
            shopTabLabel.textContent = "CLOSE SHOP";
            counter.style.transform = "translateX(-500px)";
        } else {
            shopContainer.style.bottom = "0";
            shopTabLabel.textContent = "CLOSE SHOP";
            counter.style.transform = "translateY(-100px)";
            dialogueBox.style.transform = "translateY(-100px)";
            document.body.style.backgroundPositionY = "-190px";
        }
        isMenuShowing = true;
    } else {
        if (!MOBILE) {
            shopContainer.style.right = "-900px";
            shopTabLabel.textContent = "OPEN SHOP";
            counter.style.transform = "translateX(0)";
        } else {
            shopContainer.style.bottom = "-352px";
            shopTabLabel.textContent = "OPEN SHOP";
            counter.style.transform = "translateY(0)";
            dialogueBox.style.transform = "translateY(0)";
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
            break;
    }
}
function sleep(ms) {
    ms = (skip) ? 7 : ms;
    return new Promise(resolve => setTimeout(resolve, ms));
}