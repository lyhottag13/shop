var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Tools {
    constructor(currentScreenIndex = 0, skip = false, player, dialogueBox) {
        this.currentScreenIndex = currentScreenIndex;
        this.skip = skip;
        this.player = player;
        this.dialogueBox = dialogueBox;
        this.screens = document.querySelectorAll(".screen");
    }
    keyHandler(event) {
        switch (event.key) {
            case "c":
                this.dialogueBox.toggleSkip();
                this.skip = !this.skip;
                break;
            case "e":
                this.player.playSpammableSFX("explosion");
                break;
        }
    }
    sleep(ms) {
        ms = (this.skip) ? 7 : ms;
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setCursor(instruction) {
        switch (instruction) {
            case "wait":
                document.body.style.cursor = "url('resources/images/Cursor3.webp') 16 16, auto";
                break;
            case "normal":
                document.body.style.cursor = "url('resources/images/Cursor.webp') 16 16, auto";
                break;
        }
    }
    setScreen(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nextScreenIndex, betweenScreenTime = 2000, fadeOut = betweenScreenTime, fadeIn = fadeOut, currentScreenTransition = "" }) {
            const currentScreen = this.screens[this.currentScreenIndex];
            const nextScreen = this.screens[nextScreenIndex];
            currentScreen.style.setProperty("--transition-time", `${fadeOut / 1000}s`);
            nextScreen.style.setProperty("--transition-time", `${fadeIn / 1000}s`);
            currentScreen.style.transform = currentScreenTransition;
            currentScreen.style.opacity = "0";
            yield this.sleep(betweenScreenTime);
            currentScreen.style.transform = "";
            currentScreen.style.display = "none";
            nextScreen.style.display = "flex";
            nextScreen.offsetHeight;
            nextScreen.style.opacity = "1";
            this.currentScreenIndex = nextScreenIndex;
        });
    }
    createButton(id, top, left, width, height, functionName, div) {
        div = div !== null && div !== void 0 ? div : "counter";
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
}
