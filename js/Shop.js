export class Shop {
    constructor(dialogueBoxObject, shopImages, dialogueJSON) {
        this.shopContainer = document.getElementById("shopContainer");
        this.shopTab = document.getElementById("shopTab");
        this.shopMenu = document.getElementById("shopMenu");
        this.counter = document.getElementById("counter");
        this.textDiv = document.getElementById("textDiv");
        this.arrows = document.querySelectorAll(".arrow");
        this.toggleMenuHandler = () => this.toggleMenu();
        this.arrayOfItems = [];
        this.dialogueBoxObject = dialogueBoxObject;
        this.shopImages = shopImages;
        this.dialogueJSON = dialogueJSON;
        this.isMobile = (window.innerWidth <= 600) ? true : false;
        this.currentShopIndex = 0;
        this.isMenuShowing = false;
    }
    toggleMenu() {
        const shopTabLabel = document.getElementById("shopTabLabel");
        if (this.isMenuShowing) {
            shopTabLabel.textContent = "OPEN SHOP";
            if (this.isMobile) {
                this.shopContainer.style.bottom = "-352px";
                this.counter.style.transform = "translateY(0)";
                this.textDiv.style.transform = "translateY(0)";
                document.body.style.backgroundPositionY = "0";
            } else {
                this.shopContainer.style.right = "-900px";
                this.counter.style.transform = "translateX(0)";
            }
            this.isMenuShowing = false;
        } else {
            shopTabLabel.textContent = "CLOSE SHOP";
            if (this.isMobile) {
                this.shopContainer.style.bottom = "0";
                this.counter.style.transform = "translateY(-100px)";
                this.textDiv.style.transform = "translateY(-100px)";
                document.body.style.backgroundPositionY = "-190px";
            } else {
                this.shopContainer.style.right = "100px";
                this.counter.style.transform = "translateX(-500px)";
            }
            this.isMenuShowing = true;
        }

    }
    async initializeShop() {
        const descriptionParts = document.querySelectorAll("#description span");
        const itemShowcase = document.getElementById("item");
        this.shopContainer.style.visibility = "visible";
        this.show();
        // This will generate the shop's divs and set items to each div.
        this.shopImages.forEach((_, index) => {
            this.initializeDiv(itemShowcase, index);
        });
        this.arrayOfItems.forEach((item, itemIndex) => {
            this.initializeItem(item, itemIndex, descriptionParts);
        });
        this.arrows.forEach((arrow, arrowIndex) => {
            this.initializeArrow(arrow, arrowIndex, descriptionParts);
        });
    }
    initializeArrow(arrow, arrowIndex, descriptionParts) {
        const arrowImage = arrow.querySelector("img");
        if (arrowIndex === 0) {
            arrowImage.style.transform = `rotate(${this.isMobile ? "0" : "90deg"})`;
        } else {
            arrowImage.style.transform = `rotate(${this.isMobile ? "180deg" : "270deg"})`
        }
        const direction = arrowIndex === 0 ? "" : "-";
        const displacement = `${direction}200px`;
        arrow.addEventListener("pointerdown", () => {
            this.arrowEvent(arrowIndex, displacement, descriptionParts);
        });
    }
    initializeItem(item, itemIndex, descriptionParts) {
        // This sets the default visible item to the first item.
        if (itemIndex === 0) {
            descriptionParts[0].textContent = this.dialogueJSON["itemHeader"][0];
            descriptionParts[0].style.fontSize = this.isMobile ? "35px" : "80px";
            descriptionParts[1].textContent = this.dialogueJSON["itemDescription"][0];
            descriptionParts[1].style.fontSize = this.isMobile ? "25px" : "40px";
            item.style.visibility = "visible";
        } else {
            item.style.visibility = "hidden";
            item.style.transform = `translate${this.isMobile ? "X" : "Y"}(300px) scale(0.5)`;
        }
        item.addEventListener("pointerdown", async () => {
            await this.itemEvent(itemIndex);
        });
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
    async arrowEvent(arrowIndex, displacement, descriptionParts) {
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
        descriptionParts[0].textContent = this.dialogueJSON["itemHeader"][validIndex];
        descriptionParts[1].textContent = this.dialogueJSON["itemDescription"][validIndex];
    }
    /**
     * This hides and plays the dialogue associated with the item, then 
     * shows the menu when the dialogue is over.
     * @param {number} itemIndex - The index of the item that the user clicked.
     */
    async itemEvent(itemIndex) {
        this.hide();
        await this.dialogueBoxObject.newText({ dialogueName: "itemDialogue", index: itemIndex });
        this.show();
    }
    hide() {
        this.isMenuShowing && this.toggleMenu();
        this.shopContainer.style.opacity = 0;
        this.shopTab.removeEventListener("pointerdown", this.toggleMenuHandler);
    }
    show() {
        this.shopContainer.style.opacity = 1;
        this.shopTab.addEventListener("pointerdown", this.toggleMenuHandler);
    }
}