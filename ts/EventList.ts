export const eventList = {
async doorEvent() {
    document.getElementById("doorButton").remove();
    // The door is clicked.
    player.play("doorcreak");
    await tools.sleep(1500);
    doorAnimator.setAnimation(images["Door"], 17, 13, "forwards");
    await tools.sleep(2500);
    // The website swaps to the shop screen now.
    tools.setScreen({ nextScreenIndex: 2, betweenScreenTime: 3000, currentScreenTransition: "scale(2)" });
    player.setBackgroundVolume({ endVolume: 0.3, delay: 4 });
    await tools.sleep(5000);
    tools.createButton("closedSign", isMobile ? "65%" : "62%", "5%", "90%", "20%", () => eventHandler.callEvent("closedSignEvent"), "counter");
},
async closedSignEvent() {
    await dialogueBox1.newText({ dialogueName: "closedSign" });
    if (dialogueBox1.openDialogues.get("closedSign").clicks === 2) {
        // Show lightswitch.
        await tools.sleep(1000);
        player.play("lightappear");
        tools.createButton("lightSwitch", "0", "80%", "7%", (isMobile) ? "60%" : "94%", () => eventHandler.callEvent("switchLightsEvent"), "switch");
        document.getElementById("switch").style.opacity = 1;
        await tools.sleep(1500);
    }
    return;
},
async switchLightsEvent() {
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
        tools.createButton("ali", "40%", "10%", "80%", "60%", () => eventHandler.callEvent("aliEvent"), "counter");
    }
    return;
},
async aliEvent() {
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
},
async startHowdy() {
    document.getElementById("counterAnimation").style.backgroundPositionY = `-${isMobile ? "2" : "4"}00px`;
    await counterAnimator.setAnimation(images["Emerging1"], 27, 20, "forwards", `auto ${isMobile ? "6" : "10"}00px`);
    player.playSpammableSFX("explosion");
},
async startAliAnimation() {
    await counterAnimator.setAnimation(images["Emerging2"], 18, 16, "forwards", `auto ${isMobile ? "6" : "10"}00px`);
    counterAnimator.setAnimation(images["Idle"], 17, 12, "infinite");
    document.getElementById("counterAnimation").style.backgroundPositionY = "100px";
}
}