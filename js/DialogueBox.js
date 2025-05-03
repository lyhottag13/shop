export class DialogueBox {
    constructor() {
        this.openDialogues = new Map();
        this.dialogueJSON = null;
        this.resourceJSON = null;
        this.isTyping = false;
        this.player = null;
        this.skip = false;
        this.dialogueBox = document.getElementById("textDiv");
    }
    async construct(player) {
        this.dialogueJSON = await (await fetch("js/Dialogue.json")).json()
        this.resourceJSON = await (await (fetch("Resources.json"))).json();
        this.player = player;
    }
    async displayText({ text, speed = 1, location = "text", playSound = true }) {
        if (!this.isTyping) {
            const textBox = document.getElementById(location);
            textBox.innerHTML = "";
            this.isTyping = true;
            let charAt;
            for (let i = 0; i < text.length; i++) {
                charAt = text.charAt(i);
                switch (charAt) {
                    case "|":
                        textBox.innerHTML += "<br>";
                        await this.sleep(700 * speed);
                        break;
                    case "#":
                        await this.sleep(1200 * speed);
                        textBox.innerHTML = "";
                        break;
                    case " ":
                        textBox.innerHTML += " ";
                        break;
                    case ",":
                        textBox.innerHTML += ",";
                        await this.sleep(500 * speed);
                        break;
                    case "!":
                    case ".":
                    case "?":
                        textBox.innerHTML += charAt;
                        await this.sleep(500 * speed);
                        break;
                    default:
                        textBox.innerHTML += charAt;
                        if (playSound) {
                            this.player.play("generic2");
                        }
                        await this.sleep(35 * speed);
                }
            }
            this.isTyping = false;
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
    async newText({ dialogueName, speed, location, playSound, starting: startingIndex, index }) {
        let openedDialogue = this.openDialogues.get(dialogueName);
        if (openedDialogue) {
            openedDialogue.clicks++;
        } else {
            openedDialogue = { clicks: 0 };
            this.openDialogues.set(dialogueName, openedDialogue);
        }
        const numberOfDialogues = this.dialogueJSON[dialogueName].length;
        const currentIndex = Math.min(numberOfDialogues - 1, openedDialogue.clicks);
        // If an index is selected, then we use the index. Else, we clamp it.
        const validIndex = index ?? (startingIndex ? (Math.floor(Math.random() * (numberOfDialogues - startingIndex)) + startingIndex) : currentIndex);
        const textToDisplay = this.dialogueJSON[dialogueName][validIndex];
        await this.displayText({
            text: textToDisplay,
            speed: speed,
            location: location,
            playSound: playSound
        });
        return;
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
            const aliFace = document.createElement("img");
            aliFace.src = "resources/images/Face.webp";
            document.getElementById("textDiv").prepend(aliFace);
        }
    }
    hideAli() {
        document.querySelector("#textDiv img")?.remove();
    }
}