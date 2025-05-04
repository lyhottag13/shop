import { DialogueBox } from "./DialogueBox";
import { SoundManager } from "./SoundManager";

export class Tools {
    private skip: boolean;
    private player: SoundManager;
    private dialogueBox: DialogueBox;
    private screens: NodeListOf<HTMLElement>;
    private currentScreenIndex: number;
    constructor(
        currentScreenIndex: number = 0,
        skip: boolean = false,
        player: SoundManager,
        dialogueBox: DialogueBox,
    ) {
        this.currentScreenIndex = currentScreenIndex;
        this.skip = skip;
        this.player = player;
        this.dialogueBox = dialogueBox;
        this.screens = document.querySelectorAll(".screen");
    }
    keyHandler(event: KeyboardEvent) {
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
    sleep(ms: number) {
        ms = (this.skip) ? 7 : ms;
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setCursor(instruction: string) {
        switch (instruction) {
            case "wait":
                document.body.style.cursor = "url('resources/images/Cursor3.webp') 16 16, auto";
                break;
            case "normal":
                document.body.style.cursor = "url('resources/images/Cursor.webp') 16 16, auto";
                break;
        }
    }
    async setScreen({
        nextScreenIndex,
        betweenScreenTime = 2000,
        fadeOut = betweenScreenTime,
        fadeIn = fadeOut,
        currentScreenTransition = ""
    }: ScreenSwitcherOptions) {
        const currentScreen = this.screens[this.currentScreenIndex];
        const nextScreen = this.screens[nextScreenIndex];
        currentScreen.style.setProperty("--transition-time", `${fadeOut / 1000}s`);
        nextScreen.style.setProperty("--transition-time", `${fadeIn / 1000}s`);
        currentScreen.style.transform = currentScreenTransition;
        currentScreen.style.opacity = "0";
        await this.sleep(betweenScreenTime);
        currentScreen.style.transform = "";
        currentScreen.style.display = "none";
        nextScreen.style.display = "flex";
        nextScreen.offsetHeight;
        nextScreen.style.opacity = "1";
        this.currentScreenIndex = nextScreenIndex;
    }
    createButton(id: string, top: string, left: string, width: string, height: string, functionName: () => any, div: string) {
        div = div ?? "counter";
        const button = document.createElement("button");
        button.id = id;
        button.classList.add("interactable");
        button.style.top = top;
        button.style.left = left;
        button.style.width = width;
        button.style.height = height;
        document.getElementById(div)!.appendChild(button);
        button.addEventListener("pointerdown", functionName);
    }
}
type ScreenSwitcherOptions = {
    nextScreenIndex: number,
    betweenScreenTime: number,
    fadeOut: number,
    fadeIn: number,
    currentScreenTransition: string
}