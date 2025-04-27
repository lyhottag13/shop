export class Shop {
    constructor(dialogueBox) {
        this.shopContainer = document.getElementById("shopContainer");
        this.shopTab = document.getElementById("shopTab");
        this.shopMenu = document.getElementById("shopMenu");
        this.isMenuShowing = false;
        this.counter = document.getElementById("counter");
        this.dialogueBox = document.getElementById("textDiv");
        this.MOBILE = (window.innerWidth <= 600) ? true : false;
        this.dialogueBox1 = dialogueBox;
        this.toggleMenuHandler = () => this.toggleMenu();
        this.arrayOfItems = [];
    }
    hide() {
        if (this.isMenuShowing) {
            this.toggleMenu();
        }
        this.shopContainer.style.opacity = 0;
        this.shopTab.removeEventListener("pointerdown", this.toggleMenuHandler);
    }
    show() {
        this.shopContainer.style.opacity = 1;
        this.shopTab.addEventListener("pointerdown", this.toggleMenuHandler);
    }
    toggleMenu() {
        const shopTabLabel = document.getElementById("shopTabLabel");
        if (!this.isMenuShowing) {
            if (!this.MOBILE) {
                this.shopContainer.style.right = "100px";
                shopTabLabel.textContent = "CLOSE SHOP";
                this.counter.style.transform = "translateX(-500px)";
            } else {
                this.shopContainer.style.bottom = "0";
                shopTabLabel.textContent = "CLOSE SHOP";
                this.counter.style.transform = "translateY(-100px)";
                this.dialogueBox.style.transform = "translateY(-100px)";
                document.body.style.backgroundPositionY = "-190px";
            }
            this.isMenuShowing = true;
        } else {
            if (!this.MOBILE) {
                this.shopContainer.style.right = "-900px";
                shopTabLabel.textContent = "OPEN SHOP";
                this.counter.style.transform = "translateX(0)";
            } else {
                this.shopContainer.style.bottom = "-352px";
                shopTabLabel.textContent = "OPEN SHOP";
                this.counter.style.transform = "translateY(0)";
                this.dialogueBox.style.transform = "translateY(0)";
                document.body.style.backgroundPositionY = "0";
            }
            this.isMenuShowing = false;
        }

    }
    initializeShop() {
        const descriptionParts = document.querySelectorAll("#description span");
        this.shopTab.addEventListener("pointerdown", this.toggleMenu.bind(this));
        this.shopContainer.style.visibility = "visible";
        this.shopContainer.style.opacity = 1;
        // This will generate the shop's divs and set items to each div.
        initializeShopItemDivs();
        this.arrayOfItems.forEach((item, itemIndex) => {
            this.initializeItem(item, itemIndex, descriptionParts, dialogueJSON);
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
                let selectedItem = arrayOfItems[currentShopIndex];
                if (isValidMove) {
                    selectedItem.style.transform = `translate${MOBILE ? "X" : "Y"}(${displacement})`;
                    selectedItem.style.filter = "opacity(0)";
                    currentShopIndex += arrowIndex === 0 ? -1 : 1;
                    selectedItem = arrayOfItems[currentShopIndex];
                }
                selectedItem.style.transform = `translate${MOBILE ? "X" : "Y"}(0)`;
                selectedItem.style.filter = "opacity(1)";
                selectedItem.style.visibility = "visible";
                const validIndex = Math.min(currentShopIndex, dialogueJSON["itemHeader"].length - 1);
                descriptionParts[0].textContent = dialogueJSON["itemHeader"][validIndex];
                descriptionParts[1].textContent = dialogueJSON["itemDescription"][validIndex];
            });
        });
    }
    initializeItem(item, itemIndex, descriptionParts, dialogueJSON) {
        // This sets the default visible item to the first item.
        if (itemIndex === 0) {
            descriptionParts[0].textContent = dialogueJSON["itemHeader"][0];
            descriptionParts[1].textContent = dialogueJSON["itemDescription"][0];
            item.style.visibility = "visible";
        } else {
            item.style.visibility = "hidden";
            item.style.transform = `translate${this.MOBILE ? "X" : "Y"}(300px)`;
        }
        item.addEventListener("pointerdown", async () => {
            await this.itemEvent(itemIndex);
        });
    }
    async itemEvent(itemIndex) {
        this.toggleMenu();
        this.shopContainer.style.opacity = 0;
        this.shopTab.removeEventListener("pointerdown", this.toggleMenuHandler);
        await this.dialogueBox1.newText({ dialogueName: "itemDialogue", index: itemIndex });
        this.shopContainer.style.opacity = 1;
        this.shopTab.addEventListener("pointerdown", this.toggleMenuHandler);
    }
    initializeShopItemDivs() {
        resourceJSON["shopImages"].forEach((element, index) => {
            const newItemDiv = document.createElement("div");
            newItemDiv.className = "shopItem";
            const newItemDivImage = document.createElement("img");
            newItemDivImage.src = this.shopImages[index].src;
            newItemDiv.appendChild(newItemDivImage);
            document.getElementById("item").appendChild(newItemDiv);
            this.arrayOfItems.push(newItemDiv);
        });
    }
}