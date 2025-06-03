var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Animator } from "./Animator.js";
export class DialogueBox {
    constructor(dialogueJSON, player, images) {
        this.openDialogues = new Map();
        this.dialogueJSON = dialogueJSON;
        this.isTyping = false;
        this.player = player;
        this.skip = false;
        this.dialogueBox = document.getElementById("textDiv");
        this.animator;
        this.images = images;
    }
    displayText(_a) {
        return __awaiter(this, arguments, void 0, function* ({ text, speed = 1, location = "text", playSound = true }) {
            if (!this.isTyping) {
                const textBox = document.getElementById(location);
                textBox.innerHTML = "";
                this.isTyping = true;
                let charAt;
            
                const aliFace = document.querySelector("#textDiv div");
                if (aliFace) {
                    this.animator.setAnimation(this.images["Dialogue Ali"], 2, 7, "infinite", "400", "auto 200px", "");
                }
                for (let i = 0; i < text.length; i++) {
                    charAt = text.charAt(i);
                    switch (charAt) {
                        case "|":
                            textBox.innerHTML += "<br>";
                            yield this.sleep(700 * speed);
                            break;
                        case "#":
                            yield this.sleep(1200 * speed);
                            textBox.innerHTML = "";
                            break;
                        case " ":
                            textBox.innerHTML += " ";
                            break;
                        case ",":
                            textBox.innerHTML += ",";
                            yield this.sleep(500 * speed);
                            break;
                        case "!":
                        case ".":
                        case "?":
                            textBox.innerHTML += charAt;
                            yield this.sleep(500 * speed);
                            break;
                        default:
                            textBox.innerHTML += charAt;
                            if (playSound) {
                                this.player.play("generic2");
                            }
                            yield this.sleep(35 * speed);
                    }
                }
                this.isTyping = false;
                if (aliFace) {
                    this.animator.setAnimation(this.images["Dialogue Ali"], 1, 7, "infinite", "200", "auto 200px", "");
                }
            }
            return;
        });
    }
    /**
     * Keeps track of how many times an item has been clicked and displays updating text to match.
     * @param {string} dialogueName - The name of the dialogue event to display.
     * @param {number} speed - The speed of the text, inversely proportional to the number input.
     * @param {string} location - The div location where the text will be displayed.
     * @param {boolean} playSound - Indicates whether or not this should play a sound.
     * @returns Null, just gives more control over when to continue with certain actions in cutscenes.
     */
    newText(_a) {
        return __awaiter(this, arguments, void 0, function* ({ dialogueName, speed, location, playSound, starting: startingIndex, index }) {
            let openedDialogue = this.openDialogues.get(dialogueName);
            if (openedDialogue) {
                openedDialogue.clicks++;
            }
            else {
                openedDialogue = { clicks: 0 };
                this.openDialogues.set(dialogueName, openedDialogue);
            }
            const numberOfDialogues = this.dialogueJSON[dialogueName].length;
            const currentIndex = Math.min(numberOfDialogues - 1, openedDialogue.clicks);
            // If an index is selected, then we use the index. Else, we clamp it.
            const validIndex = index !== null && index !== void 0 ? index : (startingIndex ? (Math.floor(Math.random() * (numberOfDialogues - startingIndex)) + startingIndex) : currentIndex);
            const textToDisplay = this.dialogueJSON[dialogueName][validIndex];
            yield this.displayText({
                text: textToDisplay,
                speed: speed,
                location: location,
                playSound: playSound
            });
            return;
        });
    }
    sleep(ms) {
        ms = (this.skip) ? 7 : ms;
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    toggleSkip() {
        this.skip = !this.skip;
    }
    showAliIcon() {
        if (!document.querySelector("#textDiv img")) {
            const aliFace = document.createElement("div");
            aliFace.className = "animation";
            aliFace.id = "aliFace";
            aliFace.style.height = "200px";
            aliFace.style.width = "200px";
            aliFace.style.setProperty("--bg-end", "-400px");
            aliFace.style.backgroundSize = "auto 200px";
            document.getElementById("textDiv").prepend(aliFace);
            this.animator = new Animator("aliFace");
            this.animator.setAnimation(this.images["Dialogue Ali"], 1, 2, "infinite", 200);
        }
    }
    hideAliIcon() {
        var _a;
        (_a = document.querySelector("#textDiv img")) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
