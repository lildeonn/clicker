const clickButton = document.getElementById("clicker");
const ResetButton = document.getElementById("reset");
const AmountDisplay = document.getElementById("AmountDisplay");
const ClickPerSecondDisplay = document.getElementById("ClickPerSecondDisplay");
const shopItems = document.getElementById("shop-items");
const cartItems = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const themeToggle = document.getElementById("theme-toggle");
const soundToggle = document.getElementById("sound-toggle");

let clickAmount = 0;
let lastClickTime = 0;
let clicksInSecond = 0;
let cart = [];
let total = 0;
let isDarkMode = false;
let isSoundEnabled = true;

// Sample items
const items = [
    { name: "Item 1", price: 10 },
    { name: "Item 2", price: 20 },
    { name: "Item 3", price: 30 }
];

function add() {
    clickAmount += 1;
    AmountDisplay.textContent = clickAmount;
    updateCPS();
    if (isSoundEnabled) {
        playSound("click");
    }
}

function remove() {
    clickAmount = 0;
    AmountDisplay.textContent = clickAmount;
    ClickPerSecondDisplay.textContent = "CPS";
    lastClickTime = 0;
    clicksInSecond = 0;
}

function updateCPS() {
    const currentTime = Date.now();
    if (currentTime - lastClickTime > 1000) {
        ClickPerSecondDisplay.textContent = clicksInSecond;
        clicksInSecond = 0;
        lastClickTime = currentTime;
    }
    clicksInSecond++;
}

function addToCart(item) {
    cart.push(item);
    updateCart();
    if (isSoundEnabled) {
        playSound("purchase");
    }
}

function updateCart() {
    cartItems.innerHTML = "";
    total = 0;
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(li);
        total += item.price;
    });
    totalElement.textContent = `Total: $${total}`;
}

function renderShop() {
    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.addEventListener("click", () => addToCart(item));
        li.appendChild(button);
        shopItems.appendChild(li);
    });
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
}

function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    soundToggle.textContent = isSoundEnabled ? "Sound On" : "Sound Off";
}

function playSound(type) {
    const audio = new Audio();
    if (type === "click") {
        audio.src = "click.mp3";
    } else if (type === "purchase") {
        audio.src = "purchase.mp3";
    }
    audio.play();
}

clickButton.addEventListener('click', add);
ResetButton.addEventListener('click', remove);
themeToggle.addEventListener('click', toggleTheme);
soundToggle.addEventListener('click', toggleSound);

// Initialize shop
renderShop();