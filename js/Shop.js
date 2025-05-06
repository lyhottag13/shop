var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Shop {
    constructor(dialogueBoxObject, shopImages, dialogueJSON, tools, eventHandler) {
        this.shopContainer = document.getElementById("shopContainer");
        this.shopTab = document.getElementById("shopTab");
        this.shopMenu = document.getElementById("shopMenu");
        this.counter = document.getElementById("counter");
        this.textDiv = document.getElementById("textDiv");
        this.arrows = document.querySelectorAll(".arrow");
        this.descriptionParts = document.querySelectorAll("#description span");
        this.toggleMenuHandler = () => __awaiter(this, void 0, void 0, function* () { return this.toggleMenu(); });
        this.arrayOfItems = [];
        this.dialogueBoxObject = dialogueBoxObject;
        this.shopImages = shopImages;
        this.dialogueJSON = dialogueJSON;
        this.isMobile = (window.innerWidth <= 600) ? true : false;
        this.currentShopIndex = 0;
        this.isMenuShowing = false;
        this.tools = tools;
        this.eventHandler = eventHandler;
    }
    toggleMenu() {
        const shopTabLabel = document.getElementById("shopTabLabel");
        if (this.isMenuShowing) {
            shopTabLabel.textContent = "OPEN SHOP";
            if (this.isMobile) {
                this.moveWorld("-352px", "0", "0");
            }
            else {
                this.shopContainer.style.right = "-900px";
                this.counter.style.transform = "translateX(0)";
            }
            this.isMenuShowing = false;
        }
        else {
            shopTabLabel.textContent = "CLOSE SHOP";
            if (this.isMobile) {
                this.moveWorld("0", "-100px", "-190px");
            }
            else {
                this.shopContainer.style.right = "100px";
                this.counter.style.transform = "translateX(-500px)";
            }
            this.isMenuShowing = true;
        }
    }
    moveWorld(bottom, translate, body) {
        this.shopContainer.style.bottom = bottom;
        this.counter.style.transform = `translateY(${translate})`;
        this.textDiv.style.transform = `translateY(${translate})`;
        document.body.style.backgroundPositionY = body;
    }
    initializeShop() {
        return __awaiter(this, void 0, void 0, function* () {
            const itemShowcase = document.getElementById("item");
            this.shopContainer.style.visibility = "visible";
            this.toggleMenuVisibility("show");
            // This will generate the shop's divs and set items to each div.
            this.shopImages.forEach((_, index) => {
                this.initializeDiv(itemShowcase, index);
            });
            this.arrayOfItems.forEach((item, itemIndex) => {
                this.initializeItem(item, itemIndex);
            });
            this.arrows.forEach((arrow, arrowIndex) => {
                this.initializeArrow(arrow, arrowIndex);
            });
        });
    }
    initializeArrow(arrow, arrowIndex) {
        const arrowImage = arrow.querySelector("img");
        if (arrowIndex === 0) {
            arrowImage.style.transform = `rotate(${this.isMobile ? "0" : "90"}deg)`;
        }
        else {
            arrowImage.style.transform = `rotate(${this.isMobile ? "180" : "270"}deg)`;
        }
        const direction = arrowIndex === 0 ? "" : "-";
        const displacement = `${direction}200px`;
        arrow.addEventListener("pointerdown", () => {
            this.arrowEvent(arrowIndex, displacement);
        });
    }
    initializeItem(item, itemIndex) {
        // This sets the default visible item to the first item.
        if (itemIndex === 0) {
            this.updateShopTextContent(0);
            item.style.visibility = "visible";
        }
        else {
            item.style.visibility = "hidden";
            item.style.transform = `translate${this.isMobile ? "X" : "Y"}(300px) scale(0.5)`;
        }
        item.addEventListener("pointerdown", () => __awaiter(this, void 0, void 0, function* () {
            yield this.eventList.itemEvent(itemIndex);
        }));
    }
    initializeDiv(itemShowcase, index) {
        const newItemDiv = document.createElement("div");
        newItemDiv.className = "shopItem";
        const newItemDivImage = document.createElement("img");
        newItemDivImage.src = this.shopImages[index].src;
        newItemDiv.appendChild(newItemDivImage);
        itemShowcase.appendChild(newItemDiv);
        this.arrayOfItems.push(newItemDiv);
    }
    arrowEvent(arrowIndex, displacement) {
        return __awaiter(this, void 0, void 0, function* () {
            // This checks to see if this is a valid move, i.e. we're not going left at the first, or right at the last.
            const isValidMove = ((arrowIndex === 0 && this.currentShopIndex !== 0) || (arrowIndex === 1 && this.currentShopIndex !== this.arrayOfItems.length - 1));
            let selectedItem = this.arrayOfItems[this.currentShopIndex];
            if (isValidMove) {
                selectedItem.style.transform = `translate${this.isMobile ? "X" : "Y"}(${displacement}) scale(0.5)`;
                selectedItem.style.filter = "opacity(0)";
                this.currentShopIndex += arrowIndex === 0 ? -1 : 1;
                selectedItem = this.arrayOfItems[this.currentShopIndex];
            }
            selectedItem.style.transform = `translate${this.isMobile ? "X" : "Y"}(0) scale(1)`;
            selectedItem.style.filter = "opacity(1)";
            selectedItem.style.visibility = "visible";
            const validIndex = Math.min(this.currentShopIndex, this.dialogueJSON["itemHeader"].length - 1);
            this.updateShopTextContent(validIndex);
        });
    }
    toggleMenuVisibility(instruction) {
        let cursor = "wait";
        switch (instruction) {
            case "hide":
                this.isMenuShowing && this.toggleMenu();
                this.shopContainer.style.opacity = "0";
                this.shopTab.removeEventListener("pointerdown", this.toggleMenuHandler);
                this.eventHandler.setInteractionAllowed(false);
                cursor = "wait";
                break;
            case "show":
                this.shopContainer.style.opacity = "1";
                this.shopTab.addEventListener("pointerdown", this.toggleMenuHandler);
                this.eventHandler.setInteractionAllowed(true);
                cursor = "normal";
                break;
        }
        this.tools.setCursor(cursor);
    }
    updateShopTextContent(index) {
        this.descriptionParts[0].textContent = this.dialogueJSON["itemHeader"][index];
        this.descriptionParts[1].textContent = this.dialogueJSON["itemDescription"][index];
    }
    setList(eventList) {
        this.eventList = eventList;
    }
}
