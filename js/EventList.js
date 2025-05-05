var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class EventList {
    constructor(player, tools, dialogueBox1, eventHandler, switchAnimator, counterAnimator, doorAnimator, shop, images, isMobile = window.innerWidth < 600 ? true : false) {
        this.player = player;
        this.tools = tools;
        this.dialogueBox1 = dialogueBox1;
        this.eventHandler = eventHandler;
        this.switchAnimator = switchAnimator;
        this.counterAnimator = counterAnimator;
        this.doorAnimator = doorAnimator;
        this.shop = shop;
        this.images = images;
        this.isMobile = isMobile;
        this.eventList = {
            doorEvent: this.doorEvent.bind(this),
            closedSignEvent: this.closedSignEvent.bind(this),
            switchLightsEvent: this.switchLightsEvent.bind(this),
            aliEvent: this.aliEvent.bind(this),
        };
    }
    doorEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            document.getElementById("doorButton").remove();
            // The door is clicked.
            this.player.play("doorcreak");
            yield this.tools.sleep(1500);
            this.doorAnimator.setAnimation(this.images["Door"], 17, 13, "forwards");
            yield this.tools.sleep(2500);
            // The website swaps to the shop screen now.
            this.tools.setScreen({ nextScreenIndex: 2, betweenScreenTime: 3000, currentScreenTransition: "scale(2)" });
            this.player.setBackgroundVolume({ endVolume: 0.3, delay: 4 });
            yield this.tools.sleep(5000);
            this.tools.createButton("closedSign", this.isMobile ? "65%" : "62%", "5%", "90%", "20%", () => this.eventHandler.callEvent("closedSignEvent"), "counter");
        });
    }
    closedSignEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dialogueBox1.newText({ dialogueName: "closedSign" });
            if (this.dialogueBox1.openDialogues.get("closedSign").clicks === 2) {
                // Show lightswitch.
                yield this.tools.sleep(1000);
                this.player.play("lightappear");
                this.tools.createButton("lightSwitch", "0", "80%", "7%", (this.isMobile) ? "60%" : "94%", () => this.eventHandler.callEvent("switchLightsEvent"), "switch");
                document.getElementById("switch").style.opacity = "1";
                yield this.tools.sleep(1500);
            }
            return;
        });
    }
    switchLightsEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dialogueBox1.isTyping) {
                yield this.dialogueBox1.newText({ dialogueName: "switchLights" });
                yield this.tools.sleep(1400);
                document.getElementById("lightSwitch").remove();
                this.dialogueBox1.newText({ dialogueName: "switchLights" });
                // Now you see the hand.
                this.switchAnimator.setAnimation(this.images["SwitchPull1"], 14, 25, "forwards");
                document.getElementById("switchAnimation").addEventListener("animationend", () => {
                    this.switchAnimator.setAnimation(this.images["SwitchPull2"], 24, 25, "forwards");
                }, { once: true });
                yield this.tools.sleep(13 / 25 * 1000);
                // The lights activate here.
                this.player.stopBackgroundMusic(1);
                this.player.play("lightclickdown");
                this.counterAnimator.setAnimation(this.images["OpeningBusiness"], 1, 0, "forwards");
                document.body.style.backgroundImage = `url("${this.images["Background"].src}")`;
                document.body.style.backgroundColor = "rgb(179, 115, 10)";
                document.getElementById("closedSign").remove();
                document.getElementById("switchAnimation").style.filter = "none";
                yield this.tools.sleep(13 / 25 * 1000);
                this.player.play("lightclickup");
                // Now we're displaying dialogue.
                yield this.tools.sleep(1500 - (13 / 25 * 1000));
                yield this.dialogueBox1.newText({ dialogueName: "switchLights" });
                yield this.tools.sleep(1500);
                yield this.dialogueBox1.newText({ dialogueName: "switchLights" });
                yield this.tools.sleep(2000);
                // Now Ali takes the sign.
                this.counterAnimator.setAnimation(this.images["OpeningBusiness"], 21, 23, "forwards");
                yield this.tools.sleep(21 / 23 * 1000 + 1500);
                yield this.dialogueBox1.newText({ dialogueName: "switchLights" });
                yield this.tools.sleep(1800);
                // Now Ali pops up.
                this.player.playBackgroundMusic("shop");
                this.player.setBackgroundVolume({ initialVolume: 0, endVolume: 1, delay: 0.5 });
                this.startHowdy();
                yield this.tools.sleep(800);
                this.dialogueBox1.showAliIcon();
                this.dialogueBox1.newText({ dialogueName: "ali" });
                // Now Ali has thrown his sign, it is completely gone.
                this.tools.createButton("ali", "40%", "10%", "80%", "60%", () => this.eventHandler.callEvent("aliEvent"), "counter");
            }
            return;
        });
    }
    aliEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dialogueBox1.openDialogues.get("ali").clicks === 0) {
                // This triggers if this is the first time we've talked to Ali.
                this.startAliAnimation();
                yield this.dialogueBox1.newText({ dialogueName: "ali" });
                this.shop.initializeShop();
            }
            else if (!this.dialogueBox1.isTyping) {
                // This triggers if we're just bantering.
                this.shop.toggleMenuVisibility("hide");
                yield this.dialogueBox1.newText({ dialogueName: "ali", starting: 2 });
                this.shop.toggleMenuVisibility("show");
            }
            return;
        });
    }
    startHowdy() {
        return __awaiter(this, void 0, void 0, function* () {
            document.getElementById("counterAnimation").style.backgroundPositionY = `-${this.isMobile ? "2" : "4"}00px`;
            yield this.counterAnimator.setAnimation(this.images["Emerging1"], 27, 20, "forwards", `auto ${this.isMobile ? "6" : "10"}00px`);
            this.player.playSpammableSFX("explosion");
        });
    }
    startAliAnimation() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.counterAnimator.setAnimation(this.images["Emerging2"], 18, 16, "forwards", `auto ${this.isMobile ? "6" : "10"}00px`);
            this.counterAnimator.setAnimation(this.images["Idle"], 17, 12, "infinite");
            document.getElementById("counterAnimation").style.backgroundPositionY = "100px";
        });
    }
    getList() {
        return this.eventList;
    }
}
